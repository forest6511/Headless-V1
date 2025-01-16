package com.headblog.backend.infra.repository.category

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryWithPostIdsDto
import com.headblog.backend.app.usecase.category.query.TranslationDto
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.infra.jooq.tables.references.CATEGORIES
import com.headblog.infra.jooq.tables.references.CATEGORY_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class CategoryRepositoryImpl(
    private val dsl: DSLContext
) : CategoryRepository {
    override fun save(category: Category): Int {
        val categoryResult = dsl.insertInto(CATEGORIES)
            .set(CATEGORIES.ID, category.id.value)
            .set(CATEGORIES.SLUG, category.slug.value)
            .set(CATEGORIES.PARENT_ID, category.parentId?.value)
            .execute()

        category.translations.forEach { translation ->
            dsl.insertInto(CATEGORY_TRANSLATIONS)
                .set(CATEGORY_TRANSLATIONS.CATEGORY_ID, category.id.value)
                .set(CATEGORY_TRANSLATIONS.LANGUAGE, translation.language.value)
                .set(CATEGORY_TRANSLATIONS.NAME, translation.name)
                .set(CATEGORY_TRANSLATIONS.DESCRIPTION, translation.description)
                .execute()
        }

        return categoryResult
    }

    override fun update(category: Category): Int {
        val categoryResult = dsl.update(CATEGORIES)
            .set(CATEGORIES.SLUG, category.slug.value)
            .set(CATEGORIES.PARENT_ID, category.parentId?.value)
            .where(CATEGORIES.ID.eq(category.id.value))
            .execute()

        // 既存の翻訳を削除（選択された言語のみ）
        dsl.deleteFrom(CATEGORY_TRANSLATIONS)
            .where(
                CATEGORY_TRANSLATIONS.CATEGORY_ID.eq(category.id.value)
                    .and(CATEGORY_TRANSLATIONS.LANGUAGE.eq(category.translations.first().language.value))
            )
            .execute()

        category.translations.forEach { translation ->
            dsl.insertInto(CATEGORY_TRANSLATIONS)
                .set(CATEGORY_TRANSLATIONS.CATEGORY_ID, category.id.value)
                .set(CATEGORY_TRANSLATIONS.LANGUAGE, translation.language.value)
                .set(CATEGORY_TRANSLATIONS.NAME, translation.name)
                .set(CATEGORY_TRANSLATIONS.DESCRIPTION, translation.description)
                .execute()
        }

        return categoryResult
    }

    override fun delete(category: Category): Int {
        dsl.deleteFrom(CATEGORY_TRANSLATIONS)
            .where(CATEGORY_TRANSLATIONS.CATEGORY_ID.eq(category.id.value))
            .execute()

        return dsl.deleteFrom(CATEGORIES)
            .where(CATEGORIES.ID.eq(category.id.value))
            .execute()
    }

    override fun updateParentId(oldParentId: UUID, newParentId: UUID): Int {
        return dsl.update(CATEGORIES)
            .set(CATEGORIES.PARENT_ID, newParentId)
            .where(CATEGORIES.PARENT_ID.eq(oldParentId))
            .execute()
    }

    override fun findById(id: UUID): CategoryDto? = dsl.select()
        .from(CATEGORIES)
        .leftJoin(CATEGORY_TRANSLATIONS)
        .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
        .where(CATEGORIES.ID.eq(id))
        .fetch()
        .groupBy { it[CATEGORIES.ID] }
        .values
        .firstOrNull()
        ?.toCategoryDto()

    override fun findBySlug(slug: String): CategoryDto? = dsl.select()
        .from(CATEGORIES)
        .leftJoin(CATEGORY_TRANSLATIONS)
        .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
        .where(CATEGORIES.SLUG.eq(slug))
        .fetch()
        .groupBy { it[CATEGORIES.ID] }
        .values
        .firstOrNull()
        ?.toCategoryDto()

    override fun existsByParentId(parentId: UUID): Boolean {
        val count = dsl.selectCount()
            .from(CATEGORIES)
            .where(CATEGORIES.PARENT_ID.eq(parentId))
            .fetchOne(0, Int::class.java)
        return (count ?: 0) > 0
    }

    override fun findWithPostIds(): List<CategoryWithPostIdsDto> {
        return dsl.select()
            .from(CATEGORIES)
            .leftJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .leftJoin(POST_CATEGORIES)
            .on(CATEGORIES.ID.eq(POST_CATEGORIES.CATEGORY_ID))
            .fetch()
            .groupBy { it[CATEGORIES.ID] }
            .map { (_, records) -> records.toCategoryWithPostIdsDto() }
    }

    override fun findAllByParentId(parentId: UUID): List<CategoryDto> {
        return dsl.select()
            .from(CATEGORIES)
            .where(CATEGORIES.PARENT_ID.eq(parentId))
            .fetchInto(CategoryDto::class.java)
    }

    override fun findByIdAndLanguage(id: UUID, language: String): CategoryDto? {
        return dsl.select()
            .from(CATEGORIES)
            .innerJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .where(CATEGORIES.ID.eq(id))
            .and(CATEGORY_TRANSLATIONS.LANGUAGE.eq(language))
            .fetchOne()
            ?.let { record ->
                CategoryDto(
                    id = requireNotNull(record[CATEGORIES.ID]),
                    slug = requireNotNull(record[CATEGORIES.SLUG]),
                    parentId = record[CATEGORIES.PARENT_ID],
                    translations = listOf(
                        TranslationDto(
                            language = language,
                            name = requireNotNull(record[CATEGORY_TRANSLATIONS.NAME]),
                            description = record[CATEGORY_TRANSLATIONS.DESCRIPTION],
                            createdAt = requireNotNull(record[CATEGORY_TRANSLATIONS.CREATED_AT]),
                            updatedAt = requireNotNull(record[CATEGORY_TRANSLATIONS.UPDATED_AT])
                        )
                    ),
                    createdAt = requireNotNull(record[CATEGORIES.CREATED_AT]),
                    updatedAt = requireNotNull(record[CATEGORIES.UPDATED_AT])
                )
            }
    }

    private fun List<Record>.toCategoryDto(): CategoryDto {
        val firstRecord = first()
        return CategoryDto(
            id = requireNotNull(firstRecord[CATEGORIES.ID]),
            slug = requireNotNull(firstRecord[CATEGORIES.SLUG]),
            parentId = firstRecord[CATEGORIES.PARENT_ID],
            translations = map {
                TranslationDto(
                    language = requireNotNull(it[CATEGORY_TRANSLATIONS.LANGUAGE]),
                    name = requireNotNull(it[CATEGORY_TRANSLATIONS.NAME]),
                    description = it[CATEGORY_TRANSLATIONS.DESCRIPTION],
                    createdAt = requireNotNull(it[CATEGORY_TRANSLATIONS.CREATED_AT]),
                    updatedAt = requireNotNull(it[CATEGORY_TRANSLATIONS.UPDATED_AT])
                )
            },
            createdAt = requireNotNull(firstRecord[CATEGORIES.CREATED_AT]),
            updatedAt = requireNotNull(firstRecord[CATEGORIES.UPDATED_AT])
        )
    }

    private fun List<Record>.toCategoryWithPostIdsDto(): CategoryWithPostIdsDto {
        val firstRecord = first()
        return CategoryWithPostIdsDto(
            id = requireNotNull(firstRecord[CATEGORIES.ID]),
            slug = requireNotNull(firstRecord[CATEGORIES.SLUG]),
            parentId = firstRecord[CATEGORIES.PARENT_ID],
            translations = map {
                TranslationDto(
                    language = requireNotNull(it[CATEGORY_TRANSLATIONS.LANGUAGE]),
                    name = requireNotNull(it[CATEGORY_TRANSLATIONS.NAME]),
                    description = it[CATEGORY_TRANSLATIONS.DESCRIPTION],
                    createdAt = requireNotNull(it[CATEGORY_TRANSLATIONS.CREATED_AT]),
                    updatedAt = requireNotNull(it[CATEGORY_TRANSLATIONS.UPDATED_AT])
                )
            },
            createdAt = requireNotNull(firstRecord[CATEGORIES.CREATED_AT]),
            updatedAt = requireNotNull(firstRecord[CATEGORIES.UPDATED_AT]),
            postIds = mapNotNull { it[POST_CATEGORIES.POST_ID] }
                .distinct()
                .ifEmpty { emptyList() }
        )
    }
}
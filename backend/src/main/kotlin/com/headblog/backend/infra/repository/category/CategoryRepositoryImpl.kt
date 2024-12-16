package com.headblog.backend.infra.repository.category

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryWithPostIdsDto
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.infra.jooq.tables.references.CATEGORIES
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
        return dsl.insertInto(CATEGORIES)
            .set(CATEGORIES.ID, category.id.value)
            .set(CATEGORIES.NAME, category.name)
            .set(CATEGORIES.SLUG, category.slug.value)
            .set(CATEGORIES.DESCRIPTION, category.description)
            .set(CATEGORIES.PARENT_ID, category.parentId?.value)
            .execute()
    }

    override fun update(category: Category): Int {
        return dsl.update(CATEGORIES)
            .set(CATEGORIES.NAME, category.name)
            .set(CATEGORIES.SLUG, category.slug.value)
            .set(CATEGORIES.DESCRIPTION, category.description)
            .set(CATEGORIES.PARENT_ID, category.parentId?.value)
            .where(CATEGORIES.ID.eq(category.id.value))
            .execute()
    }

    override fun delete(category: Category): Int {
        return dsl.delete(CATEGORIES)
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
        .where(CATEGORIES.ID.eq(id))
        .fetchOne()
        ?.toCategoryDto()


    override fun findBySlug(slug: String): CategoryDto? = dsl.select()
        .from(CATEGORIES)
        .where(CATEGORIES.SLUG.eq(slug))
        .fetchOne()
        ?.toCategoryDto()


    override fun existsByParentId(parentId: UUID): Boolean {
        val count = dsl.selectCount()
            .from(CATEGORIES)
            .where(CATEGORIES.PARENT_ID.eq(parentId))
            .fetchOne(0, Int::class.java)
        return (count ?: 0) > 0
    }

    override fun findTypeWithPostIds(): List<CategoryWithPostIdsDto> {
        return dsl.select(CATEGORIES.asterisk(), POST_CATEGORIES.POST_ID)
            .from(CATEGORIES)
            .leftJoin(POST_CATEGORIES)
            .on(CATEGORIES.ID.eq(POST_CATEGORIES.CATEGORY_ID))
            .fetch()
            .groupBy { it[CATEGORIES.ID] }
            .map { (_, records) -> records.toCategoryWithPostIdsDto() }
    }

    // TODO DTOを返却する
    override fun findAllByParentId(parentId: UUID): List<Category> {
        return dsl.select()
            .from(CATEGORIES)
            .where(CATEGORIES.PARENT_ID.eq(parentId))
            .fetch()
            .map { record ->
                Category.fromDto(
                    id = record[CATEGORIES.ID]!!,
                    name = record[CATEGORIES.NAME]!!,
                    slug = record[CATEGORIES.SLUG]!!,
                    description = record[CATEGORIES.DESCRIPTION],
                    parentId = record[CATEGORIES.PARENT_ID],
                    createdAt = record[CATEGORIES.CREATED_AT]!!
                )
            }
    }


    /**
     * TODO HELP
     * Add jOOQ-kotlin extension methods to help ignore nullability when mapping
     * https://github.com/jOOQ/jOOQ/issues/12934
     */
    private fun Record.toCategoryDto(): CategoryDto {
        return CategoryDto(
            id = get(CATEGORIES.ID)!!,
            name = get(CATEGORIES.NAME)!!,
            slug = get(CATEGORIES.SLUG)!!,
            description = get(CATEGORIES.DESCRIPTION),
            parentId = get(CATEGORIES.PARENT_ID),
            createdAt = get(CATEGORIES.CREATED_AT)!!
        )
    }

    private fun List<Record>.toCategoryWithPostIdsDto(): CategoryWithPostIdsDto {
        val firstRecord = first()
        return CategoryWithPostIdsDto(
            id = firstRecord[CATEGORIES.ID]!!,
            name = firstRecord[CATEGORIES.NAME]!!,
            slug = firstRecord[CATEGORIES.SLUG]!!,
            description = firstRecord[CATEGORIES.DESCRIPTION],
            parentId = firstRecord[CATEGORIES.PARENT_ID],
            createdAt = firstRecord[CATEGORIES.CREATED_AT]!!,
            postIds = mapNotNull { it[POST_CATEGORIES.POST_ID] }
                .distinct()
                .ifEmpty { emptyList() }
        )
    }
}
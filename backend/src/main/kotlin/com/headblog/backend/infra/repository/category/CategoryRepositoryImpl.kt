package com.headblog.backend.infra.repository.category

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryWithPostRefsDto
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.infra.jooq.tables.references.POST_TAXONOMIES
import com.headblog.infra.jooq.tables.references.TAXONOMIES
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class CategoryRepositoryImpl(
    private val dsl: DSLContext
) : CategoryRepository {

    override fun save(category: Category): Int {
        return dsl.insertInto(TAXONOMIES)
            .set(TAXONOMIES.ID, category.id.value)
            .set(TAXONOMIES.NAME, category.name)
            .set(TAXONOMIES.SLUG, category.slug.value)
            .set(TAXONOMIES.DESCRIPTION, category.description)
            .set(TAXONOMIES.PARENT_ID, category.parentId?.value)
            .execute()
    }

    override fun update(category: Category): Int {
        return dsl.update(TAXONOMIES)
            .set(TAXONOMIES.NAME, category.name)
            .set(TAXONOMIES.SLUG, category.slug.value)
            .set(TAXONOMIES.DESCRIPTION, category.description)
            .set(TAXONOMIES.PARENT_ID, category.parentId?.value)
            .where(TAXONOMIES.ID.eq(category.id.value))
            .execute()
    }

    override fun delete(category: Category): Int {
        return dsl.delete(TAXONOMIES)
            .where(TAXONOMIES.ID.eq(category.id.value))
            .execute()
    }

    override fun updateParentId(oldParentId: UUID, newParentId: UUID): Int {
        return dsl.update(TAXONOMIES)
            .set(TAXONOMIES.PARENT_ID, newParentId)
            .where(TAXONOMIES.PARENT_ID.eq(oldParentId))
            .execute()
    }

    override fun findById(id: UUID): CategoryDto? = dsl.select()
        .from(TAXONOMIES)
        .where(TAXONOMIES.ID.eq(id))
        .fetchOne()
        ?.toTaxonomyDto()


    override fun findBySlug(slug: String): CategoryDto? = dsl.select()
        .from(TAXONOMIES)
        .where(TAXONOMIES.SLUG.eq(slug))
        .fetchOne()
        ?.toTaxonomyDto()


    override fun existsByParentId(parentId: UUID): Boolean {
        val count = dsl.selectCount()
            .from(TAXONOMIES)
            .where(TAXONOMIES.PARENT_ID.eq(parentId))
            .fetchOne(0, Int::class.java)
        return (count ?: 0) > 0
    }

    override fun findTypeWithPostRefs(): List<CategoryWithPostRefsDto> {
        return dsl.select(TAXONOMIES.asterisk(), POST_TAXONOMIES.POST_ID)
            .from(TAXONOMIES)
            .leftJoin(POST_TAXONOMIES)
            .on(TAXONOMIES.ID.eq(POST_TAXONOMIES.TAXONOMY_ID))
            .fetch()
            .groupBy { it[TAXONOMIES.ID] }
            .map { (_, records) -> records.toTaxonomyWithPostRefsDto() }
    }

    // TODO DTOを返却する
    override fun findAllByParentId(parentId: UUID): List<Category> {
        return dsl.select()
            .from(TAXONOMIES)
            .where(TAXONOMIES.PARENT_ID.eq(parentId))
            .fetch()
            .map { record ->
                Category.fromDto(
                    id = record[TAXONOMIES.ID]!!,
                    name = record[TAXONOMIES.NAME]!!,
                    slug = record[TAXONOMIES.SLUG]!!,
                    description = record[TAXONOMIES.DESCRIPTION],
                    parentId = record[TAXONOMIES.PARENT_ID],
                    createdAt = record[TAXONOMIES.CREATED_AT]!!
                )
            }
    }


    /**
     * TODO HELP
     * Add jOOQ-kotlin extension methods to help ignore nullability when mapping
     * https://github.com/jOOQ/jOOQ/issues/12934
     */
    private fun Record.toTaxonomyDto(): CategoryDto {
        return CategoryDto(
            id = get(TAXONOMIES.ID)!!,
            name = get(TAXONOMIES.NAME)!!,
            slug = get(TAXONOMIES.SLUG)!!,
            description = get(TAXONOMIES.DESCRIPTION),
            parentId = get(TAXONOMIES.PARENT_ID),
            createdAt = get(TAXONOMIES.CREATED_AT)!!
        )
    }

    private fun List<Record>.toTaxonomyWithPostRefsDto(): CategoryWithPostRefsDto {
        val firstRecord = first()
        return CategoryWithPostRefsDto(
            id = firstRecord[TAXONOMIES.ID]!!,
            name = firstRecord[TAXONOMIES.NAME]!!,
            slug = firstRecord[TAXONOMIES.SLUG]!!,
            description = firstRecord[TAXONOMIES.DESCRIPTION],
            parentId = firstRecord[TAXONOMIES.PARENT_ID],
            createdAt = firstRecord[TAXONOMIES.CREATED_AT]!!,
            postIds = mapNotNull { it[POST_TAXONOMIES.POST_ID] }
                .distinct()
                .ifEmpty { emptyList() }
        )
    }
}
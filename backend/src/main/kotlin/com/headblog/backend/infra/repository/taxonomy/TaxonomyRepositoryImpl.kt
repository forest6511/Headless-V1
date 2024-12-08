package com.headblog.backend.infra.repository.taxonomy

import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyWithPostRefsDto
import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import com.headblog.infra.jooq.tables.references.POST_TAXONOMIES
import com.headblog.infra.jooq.tables.references.TAXONOMIES
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class TaxonomyRepositoryImpl(
    private val dsl: DSLContext
) : TaxonomyRepository {

    override fun save(taxonomy: Taxonomy): Int {
        return dsl.insertInto(TAXONOMIES)
            .set(TAXONOMIES.ID, taxonomy.id.value)
            .set(TAXONOMIES.NAME, taxonomy.name)
            .set(TAXONOMIES.TAXONOMY_TYPE, taxonomy.taxonomyType.name)
            .set(TAXONOMIES.SLUG, taxonomy.slug.value)
            .set(TAXONOMIES.DESCRIPTION, taxonomy.description)
            .set(TAXONOMIES.PARENT_ID, taxonomy.parentId?.value)
            .execute()
    }

    override fun update(taxonomy: Taxonomy): Int {
        return dsl.update(TAXONOMIES)
            .set(TAXONOMIES.NAME, taxonomy.name)
            .set(TAXONOMIES.TAXONOMY_TYPE, taxonomy.taxonomyType.name)
            .set(TAXONOMIES.SLUG, taxonomy.slug.value)
            .set(TAXONOMIES.DESCRIPTION, taxonomy.description)
            .set(TAXONOMIES.PARENT_ID, taxonomy.parentId?.value)
            .where(TAXONOMIES.ID.eq(taxonomy.id.value))
            .execute()
    }

    override fun delete(taxonomy: Taxonomy): Int {
        return dsl.delete(TAXONOMIES)
            .where(TAXONOMIES.ID.eq(taxonomy.id.value))
            .execute()
    }

    override fun updateParentId(oldParentId: UUID, newParentId: UUID): Int {
        return dsl.update(TAXONOMIES)
            .set(TAXONOMIES.PARENT_ID, newParentId)
            .where(TAXONOMIES.PARENT_ID.eq(oldParentId))
            .execute()
    }

    override fun findById(id: UUID): TaxonomyDto? = dsl.select()
        .from(TAXONOMIES)
        .where(TAXONOMIES.ID.eq(id))
        .fetchOne()
        ?.toTaxonomyDto()


    override fun findBySlug(slug: String): TaxonomyDto? = dsl.select()
        .from(TAXONOMIES)
        .where(TAXONOMIES.SLUG.eq(slug))
        .fetchOne()
        ?.toTaxonomyDto()

    override fun findByType(type: TaxonomyType): List<TaxonomyDto> = dsl.select()
        .from(TAXONOMIES)
        .where(TAXONOMIES.TAXONOMY_TYPE.eq(type.name))
        .fetch()
        .map { it.toTaxonomyDto() }


    override fun existsByParentId(parentId: UUID): Boolean {
        val count = dsl.selectCount()
            .from(TAXONOMIES)
            .where(TAXONOMIES.PARENT_ID.eq(parentId))
            .fetchOne(0, Int::class.java)
        return (count ?: 0) > 0
    }

    override fun findTypeWithPostRefs(type: TaxonomyType): List<TaxonomyWithPostRefsDto> {
        return dsl.select(TAXONOMIES.asterisk(), POST_TAXONOMIES.POST_ID)
            .from(TAXONOMIES)
            .leftJoin(POST_TAXONOMIES)
            .on(TAXONOMIES.ID.eq(POST_TAXONOMIES.TAXONOMY_ID))
            .where(TAXONOMIES.TAXONOMY_TYPE.eq(type.name))
            .fetch()
            .groupBy { it[TAXONOMIES.ID] }
            .map { (_, records) -> records.toTaxonomyWithPostRefsDto() }
    }

    override fun findAllByParentId(parentId: UUID): List<Taxonomy> {
        return dsl.select()
            .from(TAXONOMIES)
            .where(TAXONOMIES.PARENT_ID.eq(parentId))
            .fetch()
            .map { record ->
                Taxonomy.fromDto(
                    id = record[TAXONOMIES.ID]!!,
                    name = record[TAXONOMIES.NAME]!!,
                    taxonomyType = TaxonomyType.valueOf(record[TAXONOMIES.TAXONOMY_TYPE]!!),
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
    private fun Record.toTaxonomyDto(): TaxonomyDto {
        return TaxonomyDto(
            id = get(TAXONOMIES.ID)!!,
            name = get(TAXONOMIES.NAME)!!,
            taxonomyType = get(TAXONOMIES.TAXONOMY_TYPE)!!,
            slug = get(TAXONOMIES.SLUG)!!,
            description = get(TAXONOMIES.DESCRIPTION),
            parentId = get(TAXONOMIES.PARENT_ID),
            createdAt = get(TAXONOMIES.CREATED_AT)!!
        )
    }

    private fun List<Record>.toTaxonomyWithPostRefsDto(): TaxonomyWithPostRefsDto {
        val firstRecord = first()
        return TaxonomyWithPostRefsDto(
            id = firstRecord[TAXONOMIES.ID]!!,
            name = firstRecord[TAXONOMIES.NAME]!!,
            taxonomyType = firstRecord[TAXONOMIES.TAXONOMY_TYPE]!!,
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
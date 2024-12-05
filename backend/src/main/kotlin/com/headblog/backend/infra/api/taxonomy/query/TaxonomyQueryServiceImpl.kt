package com.headblog.backend.infra.api.taxonomy.query

import com.headblog.backend.app.usecase.taxonomy.query.GetTaxonomyQueryService
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyWithPostRefsDto
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import com.headblog.infra.jooq.tables.references.POST_TAXONOMIES
import com.headblog.infra.jooq.tables.references.TAXONOMIES
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Service

@Service
class TaxonomyQueryServiceImpl(
    private val dsl: DSLContext
) : GetTaxonomyQueryService {

    override fun findById(id: TaxonomyId): TaxonomyDto? = dsl.select()
        .from(TAXONOMIES)
        .where(TAXONOMIES.ID.eq(id.value))
        .fetchOne()
        ?.toTaxonomyDto()


    override fun findBySlug(slug: String): List<TaxonomyDto> = dsl.select()
        .from(TAXONOMIES)
        .where(TAXONOMIES.SLUG.eq(slug))
        .fetch()
        .map { it.toTaxonomyDto() }

    override fun findByType(type: TaxonomyType): List<TaxonomyDto> = dsl.select()
        .from(TAXONOMIES)
        .where(TAXONOMIES.TAXONOMY_TYPE.eq(type.name))
        .fetch()
        .map { it.toTaxonomyDto() }


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
package com.headblog.backend.infra.api.taxonomy.query

import com.headblog.backend.app.usecase.taxonomy.query.GetTaxonomyQueryService
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyWithPostRefsDto
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import com.headblog.infra.jooq.tables.references.POST_TAXONOMIES
import com.headblog.infra.jooq.tables.references.TAXONOMIES
import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.impl.DSL.multiset
import org.jooq.impl.DSL.select
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
        return dsl.select(
            TAXONOMIES.asterisk(),
            multiset(
                select(POST_TAXONOMIES.POST_ID)
                    .from(POST_TAXONOMIES)
                    .where(POST_TAXONOMIES.TAXONOMY_ID.eq(TAXONOMIES.ID))
            ).`as`(POST_TAXONOMIES.POST_ID.name)

        ).from(TAXONOMIES)
            .where(TAXONOMIES.TAXONOMY_TYPE.eq(type.name))
            .fetch()
            .map { it.toTaxonomyWithPostRefsDto() }
    }

    /**
     * TODO HELP
     * Add jOOQ-kotlin extension methods to help ignore nullability when mapping
     * https://github.com/jOOQ/jOOQ/issues/12934
     */
    private fun Record.toTaxonomyDto(): TaxonomyDto {
        return TaxonomyDto(
            id = TaxonomyId(get(TAXONOMIES.ID)!!),
            name = get(TAXONOMIES.NAME)!!,
            taxonomyType = TaxonomyType.valueOf(get(TAXONOMIES.TAXONOMY_TYPE)!!),
            slug = get(TAXONOMIES.SLUG)!!,
            description = get(TAXONOMIES.DESCRIPTION),
            parentId = get(TAXONOMIES.PARENT_ID),
            createdAt = get(TAXONOMIES.CREATED_AT)!!
        )
    }

    private fun Record.toTaxonomyWithPostRefsDto(): TaxonomyWithPostRefsDto = TaxonomyWithPostRefsDto(
        id = TaxonomyId(get(TAXONOMIES.ID)!!),
        name = get(TAXONOMIES.NAME)!!,
        taxonomyType = TaxonomyType.valueOf(get(TAXONOMIES.TAXONOMY_TYPE)!!),
        slug = get(TAXONOMIES.SLUG)!!,
        description = get(TAXONOMIES.DESCRIPTION),
        parentId = get(TAXONOMIES.PARENT_ID),
        createdAt = get(TAXONOMIES.CREATED_AT)!!,
        postIds = dsl.select(POST_TAXONOMIES.POST_ID)
            .from(POST_TAXONOMIES)
            .where(POST_TAXONOMIES.TAXONOMY_ID.eq(get(TAXONOMIES.ID)))
            .fetch()
            .mapNotNull { it[POST_TAXONOMIES.POST_ID]?.let(::PostId) }
            .ifEmpty { emptyList() }
    )
}
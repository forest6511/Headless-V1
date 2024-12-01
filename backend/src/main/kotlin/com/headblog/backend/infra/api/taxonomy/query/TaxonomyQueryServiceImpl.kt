package com.headblog.backend.infra.api.taxonomy.query

import com.headblog.backend.app.usecase.taxonomy.query.GetTaxonomyQueryService
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import com.headblog.infra.jooq.tables.references.TAXONOMIES
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Service

@Service
class TaxonomyQueryServiceImpl(
    private val dsl: DSLContext
) : GetTaxonomyQueryService {
    override suspend fun findById(id: TaxonomyId): TaxonomyDto? {
        return withContext(Dispatchers.IO) {
            dsl.select()
                .from(TAXONOMIES)
                .where(TAXONOMIES.ID.eq(id.value))
                .fetchOne()
        }?.toDto()
    }

    override suspend fun findBySlug(slug: String): TaxonomyDto? {
        return withContext(Dispatchers.IO) {
            dsl.select()
                .from(TAXONOMIES)
                .where(TAXONOMIES.SLUG.eq(slug))
                .fetchOne()
        }?.toDto()
    }

    override suspend fun findByType(type: TaxonomyType): List<TaxonomyDto> {
        return withContext(Dispatchers.IO) {
            dsl.select()
                .from(TAXONOMIES)
                .where(TAXONOMIES.TAXONOMY_TYPE.eq(type.name))
                .fetch()
        }.map { it.toDto() }
    }

    /**
     * TODO HELP
     * Add jOOQ-kotlin extension methods to help ignore nullability when mapping
     * https://github.com/jOOQ/jOOQ/issues/12934
     */
    private fun Record.toDto(): TaxonomyDto {
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
}
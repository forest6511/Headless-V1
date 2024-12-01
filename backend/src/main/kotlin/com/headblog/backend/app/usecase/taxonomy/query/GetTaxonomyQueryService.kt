package com.headblog.backend.app.usecase.taxonomy.query

import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyType

interface GetTaxonomyQueryService {
    suspend fun findById(id: TaxonomyId): TaxonomyDto?
    suspend fun findBySlug(slug: String): TaxonomyDto?
    suspend fun findByType(type: TaxonomyType): List<TaxonomyDto>
}
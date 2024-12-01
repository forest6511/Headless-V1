package com.headblog.backend.application.usecase.taxonomy.query

import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import java.util.*

interface GetTaxonomyQueryService {
    suspend fun findById(id: UUID): TaxonomyDto?
    suspend fun findBySlug(slug: String): TaxonomyDto?
    suspend fun findByType(type: TaxonomyType): List<TaxonomyDto>
}
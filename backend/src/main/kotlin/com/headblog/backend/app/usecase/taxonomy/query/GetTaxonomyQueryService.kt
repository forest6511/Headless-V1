package com.headblog.backend.app.usecase.taxonomy.query

import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyType

interface GetTaxonomyQueryService {
    fun findById(id: TaxonomyId): TaxonomyDto?
    fun findBySlug(slug: String): List<TaxonomyDto>
    fun findByType(type: TaxonomyType): List<TaxonomyDto>
    fun findTypeWithPostRefs(type: TaxonomyType): List<TaxonomyWithPostRefsDto>
}
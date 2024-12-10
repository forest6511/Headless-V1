package com.headblog.backend.app.usecase.taxonomy.query

import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import java.util.*

interface GetTaxonomyQueryService {
    fun findById(id: UUID): TaxonomyDto?
    fun findBySlug(slug: String): TaxonomyDto?
    fun findByType(type: TaxonomyType): List<TaxonomyDto>
    fun existsByParentId(parentId: UUID): Boolean
    fun findTaxonomyList(type: TaxonomyType): List<TaxonomyListDto>
}
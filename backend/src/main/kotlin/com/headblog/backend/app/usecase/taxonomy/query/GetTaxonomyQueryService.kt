package com.headblog.backend.app.usecase.taxonomy.query

import java.util.*

interface GetTaxonomyQueryService {
    fun findById(id: UUID): TaxonomyDto?
    fun findBySlug(slug: String): TaxonomyDto?
    fun existsByParentId(parentId: UUID): Boolean
    fun findTaxonomyList(): List<TaxonomyListDto>
}
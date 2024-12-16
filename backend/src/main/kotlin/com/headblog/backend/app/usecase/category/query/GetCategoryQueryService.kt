package com.headblog.backend.app.usecase.category.query

import java.util.*

interface GetCategoryQueryService {
    fun findById(id: UUID): CategoryDto?
    fun findBySlug(slug: String): CategoryDto?
    fun existsByParentId(parentId: UUID): Boolean
    fun findTaxonomyList(): List<CategoryListDto>
}
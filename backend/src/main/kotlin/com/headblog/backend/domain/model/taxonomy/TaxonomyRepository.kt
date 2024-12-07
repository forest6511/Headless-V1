package com.headblog.backend.domain.model.taxonomy

import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyWithPostRefsDto
import java.util.*

interface TaxonomyRepository {
    fun save(taxonomy: Taxonomy): Int

    fun findById(id: UUID): TaxonomyDto?
    fun findBySlug(slug: String): TaxonomyDto?
    fun findByType(type: TaxonomyType): List<TaxonomyDto>
    fun existsByParentId(parentId: UUID): Boolean
    fun findTypeWithPostRefs(type: TaxonomyType): List<TaxonomyWithPostRefsDto>
}
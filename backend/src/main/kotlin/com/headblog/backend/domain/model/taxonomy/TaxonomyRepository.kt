package com.headblog.backend.domain.model.taxonomy

import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyWithPostRefsDto
import java.util.*

interface TaxonomyRepository {
    fun save(taxonomy: Taxonomy): Int
    fun update(taxonomy: Taxonomy): Int
    fun delete(taxonomy: Taxonomy): Int
    fun updateParentId(oldParentId: UUID, newParentId: UUID): Int

    fun findById(id: UUID): TaxonomyDto?
    fun findBySlug(slug: String): TaxonomyDto?
    fun existsByParentId(parentId: UUID): Boolean
    fun findTypeWithPostRefs(): List<TaxonomyWithPostRefsDto>
    fun findAllByParentId(parentId: UUID): List<Taxonomy>
}
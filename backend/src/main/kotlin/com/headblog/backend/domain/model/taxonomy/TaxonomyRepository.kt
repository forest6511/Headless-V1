package com.headblog.backend.domain.model.taxonomy

interface TaxonomyRepository {
    fun save(taxonomy: Taxonomy): Taxonomy
    fun findById(id: TaxonomyId): Taxonomy?
    fun findBySlug(slug: String): Taxonomy?
    fun existsByParentId(parentId: TaxonomyId): Boolean
}
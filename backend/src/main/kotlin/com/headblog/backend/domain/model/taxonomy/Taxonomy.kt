package com.headblog.backend.domain.model.taxonomy

import com.headblog.backend.shared.exception.DomainConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDateTime
import java.util.*

class Taxonomy private constructor(
    val id: TaxonomyId,
    val name: String,
    val taxonomyType: TaxonomyType,
    val slug: Slug,
    val description: String?,
    val parentId: TaxonomyId?,
    val createdAt: LocalDateTime
) {
    companion object {
        private fun validateParentId(id: TaxonomyId, parentId: TaxonomyId?) {
            if (id.value == parentId?.value) {
                throw DomainConflictException("The parent category and the child category are the same")
            }
        }

        private fun createInstance(
            id: TaxonomyId,
            name: String,
            taxonomyType: TaxonomyType,
            slug: Slug,
            description: String?,
            parentId: TaxonomyId?,
            createdAt: LocalDateTime
        ): Taxonomy {
            validateParentId(id, parentId)
            return Taxonomy(id, name, taxonomyType, slug, description, parentId, createdAt)
        }

        fun create(
            id: IdGenerator<EntityId>,
            name: String,
            taxonomyType: String,
            slug: String,
            description: String? = null,
            parentId: UUID? = null
        ): Taxonomy {
            return createInstance(
                id = TaxonomyId(id.generate().value),
                name = name,
                taxonomyType = TaxonomyType.of(taxonomyType),
                slug = Slug.of(slug),
                description = description,
                parentId = parentId?.let { TaxonomyId(it) },
                createdAt = LocalDateTime.now()
            )
        }

        fun fromDto(
            id: UUID,
            name: String,
            taxonomyType: String,
            slug: String,
            description: String? = null,
            parentId: UUID? = null,
            createdAt: LocalDateTime
        ): Taxonomy {
            return createInstance(
                id = TaxonomyId(id),
                name = name,
                taxonomyType = TaxonomyType.of(taxonomyType),
                slug = Slug.of(slug),
                description = description,
                parentId = parentId?.let { TaxonomyId(it) },
                createdAt = createdAt
            )
        }
    }

    fun updateParent(newParent: Taxonomy): Taxonomy {
        if (this.id == newParent.id) {
            throw DomainConflictException("Cannot set self as parent")
        }
        if (this.slug.value == Slug.DEFAULT_SLUG) {
            throw DomainConflictException("Cannot change parent of default category")
        }

        return createInstance(
            id = this.id,
            name = this.name,
            taxonomyType = this.taxonomyType,
            slug = this.slug,
            description = this.description,
            parentId = newParent.id,
            createdAt = this.createdAt
        )
    }
}

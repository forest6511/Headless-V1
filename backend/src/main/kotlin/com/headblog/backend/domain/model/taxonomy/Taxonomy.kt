package com.headblog.backend.domain.model.taxonomy

import com.headblog.backend.shared.exception.DomainConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDateTime
import java.util.*

class Taxonomy private constructor(
    val id: CategoryId,
    val name: String,
    val slug: Slug,
    val description: String?,
    val parentId: CategoryId?,
    val createdAt: LocalDateTime
) {
    companion object {
        private fun validateParentId(id: CategoryId, parentId: CategoryId?) {
            if (id.value == parentId?.value) {
                throw DomainConflictException("The parent category and the child category are the same")
            }
        }

        private fun createInstance(
            id: CategoryId,
            name: String,
            slug: Slug,
            description: String?,
            parentId: CategoryId?,
            createdAt: LocalDateTime
        ): Taxonomy {
            validateParentId(id, parentId)
            return Taxonomy(id, name, slug, description, parentId, createdAt)
        }

        fun create(
            id: IdGenerator<EntityId>,
            name: String,
            slug: String,
            description: String? = null,
            parentId: UUID? = null
        ): Taxonomy {
            return createInstance(
                id = CategoryId(id.generate().value),
                name = name,
                slug = Slug.of(slug),
                description = description,
                parentId = parentId?.let { CategoryId(it) },
                createdAt = LocalDateTime.now()
            )
        }

        fun fromDto(
            id: UUID,
            name: String,
            slug: String,
            description: String? = null,
            parentId: UUID? = null,
            createdAt: LocalDateTime
        ): Taxonomy {
            return createInstance(
                id = CategoryId(id),
                name = name,
                slug = Slug.of(slug),
                description = description,
                parentId = parentId?.let { CategoryId(it) },
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
            slug = this.slug,
            description = this.description,
            parentId = newParent.id,
            createdAt = this.createdAt
        )
    }
}

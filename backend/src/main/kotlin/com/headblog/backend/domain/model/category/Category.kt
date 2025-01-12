package com.headblog.backend.domain.model.category

import com.headblog.backend.shared.exceptions.DomainConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDateTime
import java.util.*

class Category private constructor(
    val id: CategoryId,
    val slug: Slug,
    val parentId: CategoryId?,
    val createdAt: LocalDateTime,
    val translations: List<Translation>
) {
    companion object {
        private fun validateParentId(id: CategoryId, parentId: CategoryId?) {
            if (id.value == parentId?.value) {
                throw DomainConflictException("The parent category and the child category are the same")
            }
        }

        private fun createInstance(
            id: CategoryId,
            slug: Slug,
            parentId: CategoryId?,
            createdAt: LocalDateTime,
            translations: List<Translation>
        ): Category {
            validateParentId(id, parentId)
            return Category(id, slug, parentId, createdAt, translations)
        }

        fun create(
            id: IdGenerator<EntityId>,
            slug: String,
            parentId: UUID? = null,
            translations: List<Translation>
        ): Category {
            return createInstance(
                id = CategoryId(id.generate().value),
                slug = Slug.of(slug),
                parentId = parentId?.let { CategoryId(it) },
                createdAt = LocalDateTime.now(),
                translations = translations
            )
        }

        fun fromDto(
            id: UUID,
            slug: String,
            parentId: UUID? = null,
            createdAt: LocalDateTime,
            translations: List<Translation>
        ): Category {
            return createInstance(
                id = CategoryId(id),
                slug = Slug.of(slug),
                parentId = parentId?.let { CategoryId(it) },
                createdAt = createdAt,
                translations = translations
            )
        }
    }

    fun updateParent(newParent: Category): Category {
        if (this.id == newParent.id) {
            throw DomainConflictException("Cannot set self as parent")
        }
        if (this.slug.value == Slug.DEFAULT_SLUG) {
            throw DomainConflictException("Cannot change parent of default category")
        }

        return createInstance(
            id = this.id,
            slug = this.slug,
            parentId = newParent.id,
            createdAt = this.createdAt,
            translations = this.translations
        )
    }
}
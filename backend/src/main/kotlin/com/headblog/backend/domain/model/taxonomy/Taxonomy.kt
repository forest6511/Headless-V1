package com.headblog.backend.domain.model.taxonomy

import com.headblog.backend.shared.exception.AppConflictException
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
        fun create(
            id: IdGenerator<EntityId>,
            name: String,
            taxonomyType: String,
            slug: String,
            description: String? = null,
            parentId: UUID? = null,
        ): Taxonomy {
            return Taxonomy(
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
            createdAt: LocalDateTime,
        ): Taxonomy {
            return Taxonomy(
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
        // 自分自身を親にはできない
        if (this.id == newParent.id) {
            throw AppConflictException("Cannot set self as parent")
        }

        // デフォルトカテゴリーの親は変更不可
        if (this.slug.value == Slug.DEFAULT_SLUG) {
            throw AppConflictException("Cannot change parent of default category")
        }

        return Taxonomy(
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
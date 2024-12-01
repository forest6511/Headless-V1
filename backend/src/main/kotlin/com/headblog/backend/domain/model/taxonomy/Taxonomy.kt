package com.headblog.backend.domain.model.taxonomy

import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDateTime

class Taxonomy private constructor(
    val id: TaxonomyId,
    val name: String,
    val taxonomyType: TaxonomyType,
    val slug: String,
    val description: String?,
    val parentId: TaxonomyId?,
    val createdAt: LocalDateTime
) {
    companion object {
        fun create(
            idGenerator: IdGenerator<EntityId>,
            name: String,
            taxonomyType: TaxonomyType,
            slug: String,
            description: String? = null,
            parentId: TaxonomyId? = null,
        ): Taxonomy {
            validateSlug(slug)

            return Taxonomy(
                id = TaxonomyId(idGenerator.generate().value),
                name = name,
                taxonomyType = taxonomyType,
                slug = slug,
                description = description,
                parentId = parentId,
                createdAt = LocalDateTime.now()
            )
        }

        private fun validateSlug(slug: String) {
            require(slug.isNotEmpty()) { "Slug cannot be empty" }
        }
    }
}
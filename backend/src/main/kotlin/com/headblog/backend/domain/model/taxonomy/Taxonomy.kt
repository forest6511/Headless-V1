package com.headblog.backend.domain.model.taxonomy

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
            taxonomyType: TaxonomyType,
            slug: String,
            description: String? = null,
            parentId: UUID? = null,
        ): Taxonomy {

            return Taxonomy(
                id = TaxonomyId(id.generate().value),
                name = name,
                taxonomyType = taxonomyType,
                slug = Slug.of(slug),
                description = description,
                parentId = parentId?.let { TaxonomyId(it) },
                createdAt = LocalDateTime.now()
            )
        }
    }
}
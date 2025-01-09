package com.headblog.backend.domain.model.post

import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.util.*

class Post private constructor(
    val id: PostId,
    val slug: Slug,
    val status: Status,
    val featuredImageId: UUID?,
    val categoryId: CategoryId,
    val translations: List<Translation>,
) {
    companion object {

        fun create(
            id: IdGenerator<EntityId>,
            slug: String,
            status: String,
            featuredImageId: UUID?,
            categoryId: UUID,
            translations: List<Translation>,
        ): Post {
            return Post(
                id = PostId(id.generate().value),
                slug = Slug.of(slug),
                status = Status.of(status),
                featuredImageId = featuredImageId,
                categoryId = CategoryId(categoryId),
                translations = translations
            )
        }

        fun fromCommand(
            id: UUID,
            slug: String,
            status: String,
            featuredImageId: UUID?,
            categoryId: UUID,
            translations: List<Translation>,
        ): Post {
            return Post(
                id = PostId(id),
                slug = Slug.of(slug),
                status = Status.of(status),
                featuredImageId = featuredImageId,
                categoryId = CategoryId(categoryId),
                translations = translations
            )
        }
    }
}
package com.headblog.backend.domain.model.post

import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.util.*

class Post private constructor(
    val id: PostId,
    val title: String,
    val slug: Slug,
    val content: String,
    val excerpt: String,
    val postStatus: PostStatus,
    val featuredImageId: UUID?,
    val metaTitle: String?,
    val metaDescription: String?,
    val metaKeywords: String?,
    val ogTitle: String?,
    val ogDescription: String?,
    val categoryId: CategoryId,
) {
    companion object {
        fun create(
            id: IdGenerator<EntityId>,
            title: String,
            slug: String,
            content: String,
            excerpt: String,
            postStatus: String,
            featuredImageId: UUID?,
            metaTitle: String?,
            metaDescription: String?,
            metaKeywords: String?,
            ogTitle: String?,
            ogDescription: String?,
            categoryId: UUID,
        ): Post {
            return Post(
                id = PostId(id.generate().value),
                title = title,
                slug = Slug.of(slug),
                content = content,
                excerpt = excerpt,
                postStatus = PostStatus.of(postStatus),
                featuredImageId = featuredImageId,
                metaTitle = metaTitle,
                metaDescription = metaDescription,
                metaKeywords = metaKeywords,
                ogTitle = ogTitle,
                ogDescription = ogDescription,
                categoryId = CategoryId(categoryId),
            )
        }

        fun fromCommand(
            id: UUID,
            title: String,
            slug: String,
            content: String,
            excerpt: String,
            postStatus: String,
            featuredImageId: UUID?,
            metaTitle: String?,
            metaDescription: String?,
            metaKeywords: String?,
            ogTitle: String?,
            ogDescription: String?,
            categoryId: UUID,
        ): Post {
            return Post(
                id = PostId(id),
                title = title,
                slug = Slug.of(slug),
                content = content,
                excerpt = excerpt,
                postStatus = PostStatus.of(postStatus),
                featuredImageId = featuredImageId,
                metaTitle = metaTitle,
                metaDescription = metaDescription,
                metaKeywords = metaKeywords,
                ogTitle = ogTitle,
                ogDescription = ogDescription,
                categoryId = CategoryId(categoryId),
            )
        }
    }
}
package com.headblog.backend.app.usecase.post.query

import com.headblog.backend.app.usecase.tag.query.TagDto
import java.util.*

data class PostDto(
    val id: UUID,
    val title: String,
    val slug: String,
    val content: String,
    val excerpt: String,
    val postStatus: String,
    val featuredImageId: UUID?,
    val metaTitle: String?,
    val metaDescription: String?,
    val metaKeywords: String?,
    val ogTitle: String?,
    val ogDescription: String?,
    val categoryId: UUID,
    val tags: List<TagDto>,
)
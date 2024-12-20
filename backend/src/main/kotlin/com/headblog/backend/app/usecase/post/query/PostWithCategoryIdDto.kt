package com.headblog.backend.app.usecase.post.query

import java.time.LocalDateTime
import java.util.*

data class PostWithCategoryIdDto(
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
    val createdAt: LocalDateTime,
    val updateAt: LocalDateTime,
    val categoryId: UUID
)
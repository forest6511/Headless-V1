package com.headblog.backend.app.usecase.post.command.update

import java.util.*

data class UpdatePostCommand(
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
    val tagNames: Set<String> = emptySet()
)
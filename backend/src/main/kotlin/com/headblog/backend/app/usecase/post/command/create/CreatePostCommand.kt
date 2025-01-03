package com.headblog.backend.app.usecase.post.command.create

import java.util.*

data class CreatePostCommand(
    val title: String,
    val language: String,
    val content: String,
    val status: String,
    val featuredImageId: UUID?,
    val categoryId: UUID,
    val tagNames: Set<String> = emptySet()
)
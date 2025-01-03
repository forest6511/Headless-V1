package com.headblog.backend.app.usecase.post.command.update

import java.util.*

data class UpdatePostCommand(
    val id: UUID,
    val language: String,
    val title: String,
    val content: String,
    val status: String,
    val featuredImageId: UUID?,
    val categoryId: UUID,
    val tagNames: Set<String> = emptySet()
)
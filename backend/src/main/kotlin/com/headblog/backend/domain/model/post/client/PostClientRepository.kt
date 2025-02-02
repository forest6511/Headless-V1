package com.headblog.backend.domain.model.post.client

import com.headblog.backend.app.usecase.post.PostDto
import java.util.*

interface PostClientRepository {
    fun findPublishedPosts(
        language: String,
        cursorPostId: UUID?,
        pageSize: Int
    ): List<PostDto>

    fun findPublishedPostBySlug(
        language: String,
        slug: String,
    ): PostDto?
}
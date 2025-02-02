package com.headblog.backend.app.usecase.post.client.qeury

import com.headblog.backend.infra.api.client.post.response.PostClientResponse
import com.headblog.backend.infra.api.client.post.response.PostDetailClientResponse
import java.util.*

interface GetClientPostQueryService {
    fun findPublishedPosts(
        language: String,
        cursorPostId: UUID?,
        pageSize: Int
    ): List<PostClientResponse>

    fun findPublishedPostBySlug(
        language: String,
        slug: String
    ): PostDetailClientResponse
}
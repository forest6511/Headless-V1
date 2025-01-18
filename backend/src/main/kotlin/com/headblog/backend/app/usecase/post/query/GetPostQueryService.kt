package com.headblog.backend.app.usecase.post.query

import com.headblog.backend.infra.api.admin.post.response.PostListResponse
import com.headblog.backend.infra.api.admin.post.response.PostResponse
import com.headblog.backend.infra.api.client.post.response.PostClientResponse
import com.headblog.backend.infra.api.client.post.response.PostDetailClientResponse
import java.util.*

interface GetPostQueryService {
    fun findPostList(cursorPostId: UUID?, pageSize: Int): PostListResponse
    fun findPostById(postId: UUID): PostResponse
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
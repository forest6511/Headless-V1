package com.headblog.backend.app.usecase.post.admin.query

import com.headblog.backend.infra.api.admin.post.response.PostListResponse
import com.headblog.backend.infra.api.admin.post.response.PostResponse
import java.util.*

interface GetPostQueryService {
    fun findPostList(cursorPostId: UUID?, pageSize: Int): PostListResponse
    fun findPostById(postId: UUID): PostResponse
}
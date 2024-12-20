package com.headblog.backend.app.usecase.post.query

import java.util.*

interface GetPostQueryService {
    fun findPostList(cursorPostId: UUID?, pageSize: Int): PostListDto
    fun findPostById(postId: UUID): PostDto
}
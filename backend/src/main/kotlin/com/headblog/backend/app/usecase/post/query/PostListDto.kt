package com.headblog.backend.app.usecase.post.query

data class PostListDto(
    val totalCount: Int,
    val posts: List<PostWithCategoryIdResponse>,
    val totalPages: Int,
    val pageSize: Int
)
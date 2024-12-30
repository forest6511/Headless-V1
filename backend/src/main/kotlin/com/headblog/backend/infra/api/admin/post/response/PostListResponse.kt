package com.headblog.backend.infra.api.admin.post.response

data class PostListResponse(
    val totalCount: Int,
    val posts: List<PostWithCategoryIdResponse>,
    val totalPages: Int,
    val pageSize: Int
)
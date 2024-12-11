package com.headblog.backend.app.usecase.post.query

data class PostListDto(
    val totalCount: Long,
    val posts: List<PostWithTaxonomyDto>,
    val currentPage: Int,
    val totalPages: Int,
    val pageSize: Int
)
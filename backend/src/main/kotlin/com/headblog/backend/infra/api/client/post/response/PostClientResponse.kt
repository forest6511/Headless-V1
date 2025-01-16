package com.headblog.backend.infra.api.client.post.response

data class PostClientResponse(
    val slug: String,
    val title: String,
    val description: String,
    val createdAt: String,
    val updatedAt: String,
    val tags: List<String>,
    val category: CategoryClientResponse,
)
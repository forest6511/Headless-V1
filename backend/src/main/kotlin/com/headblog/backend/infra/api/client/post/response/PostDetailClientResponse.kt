package com.headblog.backend.infra.api.client.post.response

import com.headblog.backend.infra.api.admin.post.response.FeaturedImageResponse

data class PostDetailClientResponse(
    val slug: String,
    val title: String,
    val content: String,
    val description: String,
    val featuredImage: FeaturedImageResponse?,
    val createdAt: String,
    val updatedAt: String,
    val tags: List<String>,
    val category: CategoryClientResponse,
)
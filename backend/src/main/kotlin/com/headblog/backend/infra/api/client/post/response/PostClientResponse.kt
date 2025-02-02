package com.headblog.backend.infra.api.client.post.response

import com.headblog.backend.infra.api.admin.post.response.FeaturedImageResponse

data class PostClientResponse(
    val slug: String,
    val title: String,
    val description: String,
    val createdAt: String,
    val updatedAt: String,
    val tags: List<String>,
    val featuredImage: FeaturedImageResponse?,
    val category: CategoryClientResponse,
)
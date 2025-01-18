package com.headblog.backend.infra.api.client.category.response

import com.headblog.backend.infra.api.client.post.response.PostClientResponse

data class CategoryWithArticlesClientResponse(
    val category: CategoryDetailClientResponse,
    val articles: List<PostClientResponse>
)
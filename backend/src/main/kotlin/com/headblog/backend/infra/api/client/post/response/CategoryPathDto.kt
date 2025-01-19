package com.headblog.backend.infra.api.client.post.response

data class CategoryPathDto(
    val slug: String,
    val name: String,
    val description: String?,
)

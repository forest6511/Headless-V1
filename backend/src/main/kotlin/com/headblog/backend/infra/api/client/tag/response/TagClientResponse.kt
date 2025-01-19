package com.headblog.backend.infra.api.client.tag.response

import com.headblog.backend.infra.api.client.post.response.PostDetailClientResponse

data class TagClientResponse(
    val name: String,
    val slug: String,
    val articles: List<PostDetailClientResponse>
)
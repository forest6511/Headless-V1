package com.headblog.backend.infra.api.admin.post.response

data class PostTranslationResponse(
    val language: String,
    val status: String,
    val title: String,
    val excerpt: String,
    val content: String
)

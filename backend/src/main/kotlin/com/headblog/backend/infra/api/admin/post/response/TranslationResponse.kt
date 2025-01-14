package com.headblog.backend.infra.api.admin.post.response

data class TranslationResponse(
    val language: String,
    val status: String,
    val title: String,
    val excerpt: String,
    val content: String
)

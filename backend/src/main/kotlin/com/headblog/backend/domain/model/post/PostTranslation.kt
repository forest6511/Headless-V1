package com.headblog.backend.domain.model.post

data class PostTranslation(
    val language: Language,
    val title: String,
    val excerpt: String,
    val content: String
)
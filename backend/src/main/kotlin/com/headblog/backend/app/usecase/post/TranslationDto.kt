package com.headblog.backend.app.usecase.post

data class TranslationDto(
    val language: String,
    val status: String,
    val title: String,
    val excerpt: String,
    val content: String
)

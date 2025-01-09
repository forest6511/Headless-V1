package com.headblog.backend.app.usecase.category.query

import java.time.LocalDateTime

data class TranslationDto(
    val language: String,
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

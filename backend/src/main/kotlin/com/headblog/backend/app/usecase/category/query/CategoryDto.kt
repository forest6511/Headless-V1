package com.headblog.backend.app.usecase.category.query

import java.time.LocalDateTime
import java.util.*

data class CategoryDto(
    val id: UUID,
    val slug: String,
    val parentId: UUID?,
    val translations: List<CategoryTranslationDto>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
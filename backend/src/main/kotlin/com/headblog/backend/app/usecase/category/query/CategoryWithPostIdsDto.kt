package com.headblog.backend.app.usecase.category.query

import java.time.LocalDateTime
import java.util.*

data class CategoryWithPostIdsDto(
    val id: UUID,
    val slug: String,
    val parentId: UUID?,
    val translations: List<TranslationDto>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val postIds: List<UUID>
)
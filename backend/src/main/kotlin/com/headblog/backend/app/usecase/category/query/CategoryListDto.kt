package com.headblog.backend.app.usecase.category.query

import java.time.LocalDateTime
import java.util.*

data class CategoryListDto(
    val id: UUID,
    val slug: String,
    val parentId: UUID?,
    val translations: List<CategoryTranslationDto>,
    val createdAt: LocalDateTime,
    val postIds: List<UUID>,
    val breadcrumbs: List<BreadcrumbDto>
)

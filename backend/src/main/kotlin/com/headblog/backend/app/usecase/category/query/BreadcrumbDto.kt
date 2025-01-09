package com.headblog.backend.app.usecase.category.query

import java.util.*

data class BreadcrumbDto(
    val id: UUID,
    val slug: String,
    val translations: List<BreadcrumbTranslationDto>
)
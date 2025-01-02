package com.headblog.backend.app.usecase.post.query

import com.headblog.backend.app.usecase.tag.query.TagDto
import java.time.LocalDateTime
import java.util.*

data class PostWithTranslationsDto(
    val id: UUID,
    val slug: String,
    val status: String,
    val featuredImageId: UUID?,
    val categoryId: UUID,
    val tags: List<TagDto>,
    val translations: List<TranslationDto>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

package com.headblog.backend.app.usecase.post


import com.headblog.backend.app.usecase.tag.query.TagDto
import java.time.LocalDateTime
import java.util.*

data class PostDto(
    val id: UUID,
    val slug: String,
    val featuredImageId: UUID?,
    val featuredImage: FeaturedImageDto?,
    val categoryId: UUID,
    val tags: List<TagDto>,
    val translations: List<PostTranslationDto>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

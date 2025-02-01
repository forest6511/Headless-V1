package com.headblog.backend.infra.api.admin.post.response

import com.headblog.backend.app.usecase.tag.query.TagDto
import java.time.LocalDateTime
import java.util.*

data class PostResponse(
    val id: UUID,
    val slug: String,
    val featuredImageId: UUID?,
    val featuredImage: FeaturedImageResponse?,
    val categoryId: UUID,
    val tags: List<TagDto>,
    val translations: List<TranslationResponse>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
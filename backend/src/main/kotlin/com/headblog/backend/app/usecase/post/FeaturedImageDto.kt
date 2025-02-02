package com.headblog.backend.app.usecase.post

import com.headblog.backend.app.usecase.media.query.MediaTranslationDto
import java.util.*

data class FeaturedImageDto(
    val id: UUID,
    val thumbnailUrl: String,
    val mediumUrl: String,
    val translations: List<MediaTranslationDto>
)

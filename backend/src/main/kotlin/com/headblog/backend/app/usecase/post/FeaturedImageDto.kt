package com.headblog.backend.app.usecase.post

import java.util.*
import com.headblog.backend.app.usecase.media.query.TranslationDto as MediaTranslationDto

data class FeaturedImageDto(
    val id: UUID,
    val thumbnailUrl: String,
    val mediumUrl: String,
    val translations: List<MediaTranslationDto>
)

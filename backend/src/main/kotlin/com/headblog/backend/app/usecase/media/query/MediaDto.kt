package com.headblog.backend.app.usecase.media.query

import java.time.LocalDateTime
import java.util.*

data class MediaDto(
    val id: UUID,
    val title: String,
    val uploadedBy: UUID,
    val thumbnailUrl: String,
    val thumbnailSize: Int,
    val smallUrl: String,
    val smallSize: Int,
    val largeUrl: String,
    val largeSize: Int,
    val createdAt: LocalDateTime,
    val translations: List<MediaTranslationDto>,
)
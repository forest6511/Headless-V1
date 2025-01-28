package com.headblog.backend.app.usecase.media.query

import java.time.LocalDateTime
import java.util.*

data class MediaDto(
    val id: UUID,
    val title: String,
    val uploadedBy: UUID,
    val thumbnailUrl: String,
    val thumbnailSize: Long,
    val mediumUrl: String,
    val mediumSize: Long,
    val createdAt: LocalDateTime,
    val translations: List<TranslationDto>,
)
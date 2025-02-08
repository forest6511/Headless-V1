package com.headblog.backend.infra.api.admin.media.response

import java.time.LocalDateTime
import java.util.*

data class MediaResponse(
    val id: UUID,
    val uploadedBy: UUID,
    val thumbnailUrl: String,
    val thumbnailSize: Int,
    val smallUrl: String,
    val smallSize: Int,
    val largeUrl: String,
    val largeSize: Int,
    val createdAt: LocalDateTime,
    val translations: List<MediaTranslationResponse>,
)
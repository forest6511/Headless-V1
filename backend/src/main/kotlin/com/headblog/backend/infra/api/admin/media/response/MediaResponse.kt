package com.headblog.backend.infra.api.admin.media.response

import java.time.LocalDateTime
import java.util.*

data class MediaResponse(
    val id: UUID,
    val uploadedBy: UUID,
    val thumbnailUrl: String,
    val thumbnailSize: Long,
    val mediumUrl: String,
    val mediumSize: Long,
    val createdAt: LocalDateTime,
    val translations: List<TranslationResponse>,
)
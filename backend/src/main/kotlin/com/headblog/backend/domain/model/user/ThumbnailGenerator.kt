package com.headblog.backend.domain.model.user

import com.headblog.backend.domain.model.common.Language

interface ThumbnailGenerator {
    fun generateThumbnailUrl(nickname: String, language: Language, extension: String): ByteArray
}
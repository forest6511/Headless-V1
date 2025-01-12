package com.headblog.backend.domain.model.user

interface ThumbnailGenerator {
    fun generateThumbnailUrl(nickname: String, language: Language, extension: String): ByteArray
}
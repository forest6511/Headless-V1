package com.headblog.backend.domain.model.user

@JvmInline
value class ThumbnailKey private constructor(val value: String) {
    companion object {
        private const val KEY_PREFIX = "profile"
        fun of(filename: String): ThumbnailKey {
            return ThumbnailKey("$KEY_PREFIX/$filename")
        }
    }
}
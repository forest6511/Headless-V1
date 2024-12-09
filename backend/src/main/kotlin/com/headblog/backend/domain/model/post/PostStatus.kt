package com.headblog.backend.domain.model.post

enum class PostStatus(val label: String) {
    DRAFT("下書き"),
    PUBLISHED("公開済み");

    companion object {
        fun of(value: String): PostStatus {
            return entries.find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("Invalid PostStatus: $value")
        }
    }
}
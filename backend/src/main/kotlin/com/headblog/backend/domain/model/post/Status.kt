package com.headblog.backend.domain.model.post

enum class Status(val label: String) {
    DRAFT("下書き"),
    PUBLISHED("公開済み");

    companion object {
        fun of(value: String): Status {
            return entries.find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("Invalid Post status: $value")
        }
    }
}
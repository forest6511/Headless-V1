package com.headblog.backend.domain.model.post

data class Language(
    val value: String
) {
    init {
        require(ALLOWED_LANGUAGE_CODES.contains(value.lowercase())) {
            "Unsupported language code: $value"
        }
    }

    companion object {
        private val ALLOWED_LANGUAGE_CODES = setOf("en", "ja")

        fun of(code: String): Language {
            return Language(code.lowercase())
        }
    }
}

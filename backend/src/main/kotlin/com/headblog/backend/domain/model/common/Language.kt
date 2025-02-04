package com.headblog.backend.domain.model.common

import com.headblog.backend.shared.constants.LanguageConstants.SUPPORTED_LANGUAGES

data class Language(
    val value: String
) {
    init {
        require(ALLOWED_LANGUAGE_CODES.contains(value.lowercase())) {
            "Unsupported language code: $value"
        }
    }

    companion object {
        private val ALLOWED_LANGUAGE_CODES = SUPPORTED_LANGUAGES

        fun of(code: String): Language {
            return Language(code.lowercase())
        }
    }
}

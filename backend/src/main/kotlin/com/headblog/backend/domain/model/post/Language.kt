package com.headblog.backend.domain.model.post

import com.headblog.backend.shared.constants.LanguageConstants.SUPPORTED_LANGUAGES

data class Language(
    val value: String
) {
    init {
        require(SUPPORTED_LANGUAGES.contains(value.lowercase())) {
            "Unsupported language for post code: $value"
        }
    }

    companion object {
        fun of(code: String): Language {
            return Language(code.lowercase())
        }
    }
}

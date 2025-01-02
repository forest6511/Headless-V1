package com.headblog.backend.app.usecase.translation

interface TranslationService {
    fun translateToEnglish(content: String): Result<String>
}
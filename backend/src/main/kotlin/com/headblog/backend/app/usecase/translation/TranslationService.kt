package com.headblog.backend.app.usecase.translation

interface TranslationService {
    fun translate(content: String, sourceLanguage: String): Result<String>
    fun summarizeContent(content: String, language: String): Result<String>
    fun translateSummary(excerpt: String, sourceLanguage: String): Result<String>
    fun translateTitle(title: String, sourceLanguage: String): Result<String>
}
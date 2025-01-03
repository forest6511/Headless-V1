package com.headblog.backend.app.usecase.translation

interface TranslationService {
    fun translateToEnglish(content: String): Result<String>
    fun summarizeJapaneseContent(content: String): Result<String>
    fun translateSummarizeToEnglish(excerpt: String): Result<String>
    fun translateTitleToEnglish(title: String): Result<String>
}
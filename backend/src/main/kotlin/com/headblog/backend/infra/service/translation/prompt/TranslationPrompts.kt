package com.headblog.backend.infra.service.translation.prompt

import com.headblog.backend.app.usecase.translation.TranslationOptions

object TranslationPrompts {

    fun createTranslationPrompt(
        content: String,
        options: TranslationOptions
    ): String = buildString {
        appendLine("Instructions for translating the following Japanese text to English:")
        appendLine("- Preserve all HTML tags and attributes")
        appendLine("- Keep the original formatting intact")
        appendLine("- Maintain URLs as they are")
        appendLine("- Style: ${options.style.name.lowercase().replace('_', ' ')}")
        appendLine("- Tone: ${options.tone.name.lowercase().replace('_', ' ')}")
        appendLine()
        appendLine("Original text:")
        append(content)
    }

    fun createSummaryPrompt(content: String): String = buildString {
        appendLine("以下の日本語テキストを要約してください:")
        appendLine("- 255文字以内で簡潔に要約")
        appendLine("- 元の内容の重要なポイントを漏らさない")
        appendLine("- 自然な日本語で表現")
        appendLine()
        appendLine("原文:")
        append(content)
    }

    fun createSummaryTranslationPrompt(summary: String): String = buildString {
        appendLine("Translate the following Japanese summary to English:")
        appendLine("- Keep the translation concise, up to 255 characters")
        appendLine("- Preserve the original meaning and key points")
        appendLine()
        appendLine("Original Summary:")
        append(summary)
    }

    // タイトル用の新しいプロンプト
    fun createTitleTranslationPrompt(content: String): String = buildString {
        appendLine("Translate the following Japanese blog title to English:")
        appendLine("- Keep it concise and impactful")
        appendLine("- Maintain the original meaning and nuance")
        appendLine("- Use title case appropriately")
        appendLine("- Ensure it's SEO-friendly")
        appendLine()
        appendLine("Original title:")
        append(content)
    }
}
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
        appendLine("- 100文字以内で簡潔に要約")
        appendLine("- 元の内容の重要なポイントを漏らさない")
        appendLine("- 自然な日本語で表現")
        appendLine()
        appendLine("原文:")
        append(content)
    }

    // 要約翻訳用プロンプト
    fun createSummaryTranslationPrompt(summary: String): String = buildString {
        appendLine("Translate the following Japanese to English in 100 characters or less, preserving the original meaning and key points:")
        appendLine(summary)
    }

    // タイトル用プロンプト
    fun createTitleTranslationPrompt(content: String): String = buildString {
        appendLine("Translate this Japanese blog title to English. Provide only one concise translation:")
        append(content)
    }
}

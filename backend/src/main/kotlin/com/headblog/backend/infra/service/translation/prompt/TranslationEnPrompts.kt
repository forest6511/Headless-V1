package com.headblog.backend.infra.service.translation.prompt

import com.headblog.backend.app.usecase.translation.TranslationOptions

object TranslationEnPrompts {

    fun createTranslationPrompt(
        content: String,
        options: TranslationOptions
    ): String = buildString {
        appendLine("以下の英文を日本語に翻訳する際の指示:")
        appendLine("- すべてのHTMLタグと属性を保持すること")
        appendLine("- 元の書式をそのまま維持すること")
        appendLine("- URLは変更せずそのまま使用すること")
        appendLine("- スタイル: ${options.style.name.lowercase().replace('_', ' ')}")
        appendLine("- トーン: ${options.tone.name.lowercase().replace('_', ' ')}")
        appendLine()
        appendLine("原文:")
        append(content)
    }

    fun createSummaryPrompt(content: String): String = buildString {
        appendLine("Summarize the following English text:")
        appendLine("- Provide a concise summary within 100 characters")
        appendLine("- Do not omit important points from the original content")
        appendLine("- Express in natural English")
        appendLine()
        appendLine("Original text:")
        append(content)
    }

    fun createSummaryTranslationPrompt(summary: String): String = buildString {
        appendLine("以下の英文を100文字以内の日本語に要約して翻訳:")
        appendLine(summary)
    }

    fun createTitleTranslationPrompt(content: String): String = buildString {
        appendLine("簡潔に英語から日本語に1行で翻訳:")
        append(content)
    }
}
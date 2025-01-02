package com.headblog.backend.infra.service.translation.prompt

object TranslationPrompts {
    fun createTranslationPrompt(
        content: String,
        options: Map<String, String> = emptyMap()
    ): String = """
        Instructions for translating the following Japanese text to English:
        - Preserve all HTML tags and attributes
        - Keep the original formatting intact
        - Maintain URLs as they are
        ${options.entries.joinToString("\n") { "- ${it.key}: ${it.value}" }}

        Original text:
        $content
    """.trimIndent()
}
package com.headblog.backend.infra.service.translation

import com.headblog.backend.app.usecase.translation.TranslationService
import com.headblog.backend.infra.service.translation.prompt.TranslationPrompts
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class GeminiTranslationService(
    private val geminiClient: GeminiClient
) : TranslationService {
    private val logger = LoggerFactory.getLogger(GeminiTranslationService::class.java)

    override fun translateToEnglish(content: String): Result<String> {
        logger.debug("Starting translation process")

        val prompt = TranslationPrompts.createTranslationPrompt(
            content = content,
            options = mapOf(
                // プロフェッショナルで自然な文章
                "Style" to "Professional and natural",
                // 元の文章のトーンを維持すること
                "Tone" to "Consistent with the original"
            )
        )

        return try {
            geminiClient.generateContent(prompt).also {
                logger.debug("Translation completed successfully")
            }
        } catch (e: Exception) {
            logger.error("Translation failed", e)
            Result.failure(e)
        }
    }
}
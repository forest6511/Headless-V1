package com.headblog.backend.infra.service.translation

import com.headblog.backend.app.usecase.translation.TranslationOptions
import com.headblog.backend.app.usecase.translation.TranslationService
import com.headblog.backend.app.usecase.translation.TranslationStyle
import com.headblog.backend.app.usecase.translation.TranslationTone
import com.headblog.backend.infra.service.translation.prompt.TranslationPrompts
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class GeminiTranslationService(
    private val geminiClient: GeminiClient
) : TranslationService {
    private val logger = LoggerFactory.getLogger(javaClass)

    // コンテンツ翻訳
    override fun translateToEnglish(content: String): Result<String> {
        logger.debug("Starting translation process")

        val options = TranslationOptions(
            style = TranslationStyle.PROFESSIONAL_AND_NATURAL,
            tone = TranslationTone.CONSISTENT_WITH_ORIGINAL
        )

        val prompt = TranslationPrompts.createTranslationPrompt(
            content = content,
            options = options
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

    // コンテンツ要約
    override fun summarizeJapaneseContent(content: String): Result<String> {
        logger.debug("Starting summarization process")

        val prompt = TranslationPrompts.createSummaryPrompt(content)

        return try {
            geminiClient.generateContent(prompt).also {
                logger.debug("Summarization completed successfully")
            }
        } catch (e: Exception) {
            logger.error("Summarization failed", e)
            Result.failure(e)
        }
    }

    override fun translateSummarizeToEnglish(excerpt: String): Result<String> {
        logger.debug("Starting summary translation process")

        val translatePrompt = TranslationPrompts.createSummaryTranslationPrompt(excerpt)

        return try {
            geminiClient.generateContent(translatePrompt).also {
                logger.debug("Summary translation completed successfully")
            }
        } catch (e: Exception) {
            logger.error("Summary translation failed", e)
            Result.failure(e)
        }
    }

    // タイトル翻訳
    override fun translateTitleToEnglish(title: String): Result<String> {
        logger.debug("Starting title translation process")

        val prompt = TranslationPrompts.createTitleTranslationPrompt(title)

        return try {
            geminiClient.generateContent(prompt).also {
                logger.debug("Title translation completed successfully")
            }
        } catch (e: Exception) {
            logger.error("Title translation failed", e)
            Result.failure(e)
        }
    }
}
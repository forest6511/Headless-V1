package com.headblog.backend.infra.service.translation

import com.headblog.backend.app.usecase.translation.TranslationOptions
import com.headblog.backend.app.usecase.translation.TranslationService
import com.headblog.backend.app.usecase.translation.TranslationStyle
import com.headblog.backend.app.usecase.translation.TranslationTone
import com.headblog.backend.infra.service.translation.prompt.TranslationEnPrompts
import com.headblog.backend.infra.service.translation.prompt.TranslationJaPrompts
import com.headblog.backend.shared.constants.LanguageConstants
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class GeminiTranslationService(
    private val geminiClient: GeminiClient
) : TranslationService {
    private val logger = LoggerFactory.getLogger(javaClass)

    override fun translate(content: String, sourceLanguage: String): Result<String> {
        logger.debug("Starting translation process")

        val options = TranslationOptions(
            style = TranslationStyle.PROFESSIONAL_AND_NATURAL,
            tone = TranslationTone.CONSISTENT_WITH_ORIGINAL
        )

        val prompt = when (sourceLanguage) {
            LanguageConstants.JA -> TranslationEnPrompts.createTranslationPrompt(content, options)
            LanguageConstants.EN -> TranslationJaPrompts.createTranslationPrompt(content, options)
            else -> throw IllegalArgumentException("Unsupported language: $sourceLanguage")
        }

        return try {
            geminiClient.generateContent(prompt).also {
                logger.debug("Translation completed successfully")
            }
        } catch (e: Exception) {
            logger.error("Translation failed", e)
            Result.failure(e)
        }
    }

    override fun summarizeContent(content: String, language: String): Result<String> {
        logger.debug("Starting summarization process")
        // コンテンツの要約は、翻訳ではなく同じ言語で要約するのみ
        val prompt = when (language) {
            LanguageConstants.JA -> TranslationJaPrompts.createSummaryPrompt(content)
            LanguageConstants.EN -> TranslationEnPrompts.createSummaryPrompt(content)
            else -> throw IllegalArgumentException("Unsupported language: $language")
        }
        return try {
            geminiClient.generateContent(prompt).also {
                logger.debug("Summarization completed successfully")
            }
        } catch (e: Exception) {
            logger.error("Summarization failed", e)
            Result.failure(e)
        }
    }

    override fun translateSummary(excerpt: String, sourceLanguage: String): Result<String> {
        logger.debug("Starting summary translation process")

        val translatePrompt = when (sourceLanguage) {
            LanguageConstants.JA -> TranslationEnPrompts.createSummaryTranslationPrompt(excerpt)
            LanguageConstants.EN -> TranslationJaPrompts.createSummaryTranslationPrompt(excerpt)
            else -> throw IllegalArgumentException("Unsupported language: $sourceLanguage")
        }

        return try {
            geminiClient.generateContent(translatePrompt).also {
                logger.debug("Summary translation completed successfully")
            }
        } catch (e: Exception) {
            logger.error("Summary translation failed", e)
            Result.failure(e)
        }
    }

    override fun translateTitle(title: String, sourceLanguage: String): Result<String> {
        logger.debug("Starting title translation process")

        val prompt = when (sourceLanguage) {
            LanguageConstants.JA -> TranslationEnPrompts.createTitleTranslationPrompt(title)
            LanguageConstants.EN -> TranslationJaPrompts.createTitleTranslationPrompt(title)
            else -> throw IllegalArgumentException("Unsupported language: $sourceLanguage")
        }

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
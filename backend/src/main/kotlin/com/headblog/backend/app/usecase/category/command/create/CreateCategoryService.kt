package com.headblog.backend.app.usecase.category.command.create

import com.headblog.backend.app.usecase.translation.TranslationService
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryTranslation
import com.headblog.backend.domain.model.category.admin.CategoryRepository
import com.headblog.backend.domain.model.common.Language
import com.headblog.backend.shared.constants.LanguageConstants
import com.headblog.backend.shared.exceptions.AppConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CreateCategoryService(
    private val categoryRepository: CategoryRepository,
    private val idGenerator: IdGenerator<EntityId>,
    private val translationService: TranslationService
) : CreateCategoryUseCase {
    private val logger = LoggerFactory.getLogger(javaClass)

    override fun execute(command: CreateCategoryCommand): CategoryId {

        val (sourceLang, targetLang) = when (command.language) {
            LanguageConstants.JA -> LanguageConstants.JA to LanguageConstants.EN
            LanguageConstants.EN -> LanguageConstants.EN to LanguageConstants.JA
            else -> throw AppConflictException("Unsupported language: ${command.language}")
        }

        // 翻訳の生成
        val translatedName = translate {
            translationService.translateTitle(command.name, targetLang)
        }

        val translatedDescription = command.description?.let { description ->
            translate {
                translationService.translate(description, targetLang)
            }
        }

        logger.debug("選択言語: ${command.language}")
        logger.debug("翻訳言語: $targetLang")
        logger.debug("タイトル: $translatedName")
        logger.debug("翻訳タイトル: $translatedName")

        // 常に英語のSlug
        val slug = generateSlug(if (sourceLang == LanguageConstants.JA) translatedName else command.name)

        // slugの重複チェック
        categoryRepository.findBySlug(slug)?.let {
            throw AppConflictException("Category with slug '$slug' already exists")
        }

        val category = Category.create(
            id = idGenerator,
            slug = slug,
            parentId = command.parentId,
            translations = listOf(
                CategoryTranslation(
                    language = Language.of(sourceLang),
                    name = command.name,
                    description = command.description
                ),
                CategoryTranslation(
                    language = Language.of(targetLang),
                    name = translatedName,
                    description = translatedDescription
                )
            )
        )

        categoryRepository.save(category)
        return category.id
    }

    private fun translate(block: () -> Result<String>): String {
        return block().getOrElse {
            logger.error("Translation failed", it)
            throw AppConflictException("Translation failed")
        }
    }

    private fun generateSlug(englishName: String): String {
        return englishName
            .lowercase()
            .replace(Regex("[^a-z0-9\\s]"), "")
            .replace(Regex("\\s+"), "-")
            .trim('-')
    }
}
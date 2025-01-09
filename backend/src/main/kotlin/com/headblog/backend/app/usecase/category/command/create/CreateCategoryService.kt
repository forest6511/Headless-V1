package com.headblog.backend.app.usecase.category.command.create

import com.headblog.backend.app.usecase.translation.TranslationService
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.category.Language
import com.headblog.backend.domain.model.category.Translation
import com.headblog.backend.shared.exception.AppConflictException
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
        // 英語翻訳の生成
        val englishName = translate {
            translationService.translateTitleToEnglish(command.name)
        }
        val englishDescription = command.description?.let { description ->
            translate {
                translationService.translateToEnglish(description)
            }
        }

        val slug = generateSlug(englishName)

        // slugの重複チェック
        categoryRepository.findBySlug(slug)?.let {
            throw AppConflictException("Category with slug '$slug' already exists")
        }

        val category = Category.create(
            id = idGenerator,
            slug = slug,
            parentId = command.parentId,
            translations = listOf(
                Translation(
                    language = Language.of(command.language),
                    name = command.name,
                    description = command.description
                ),
                Translation(
                    language = Language.of("en"),
                    name = englishName,
                    description = englishDescription
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
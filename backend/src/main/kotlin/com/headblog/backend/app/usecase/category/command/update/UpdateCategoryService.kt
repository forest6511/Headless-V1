package com.headblog.backend.app.usecase.category.command.update

import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.category.Language
import com.headblog.backend.domain.model.category.Translation
import com.headblog.backend.shared.exception.AppConflictException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UpdateCategoryService(
    private val categoryRepository: CategoryRepository
) : UpdateCategoryUseCase {
    private val logger = LoggerFactory.getLogger(javaClass)

    override fun execute(command: UpdateCategoryCommand): CategoryId {
        val categoryDto = categoryRepository.findById(command.id)
            ?: throw AppConflictException("Category with ID ${command.id} not found")

        // ドメインの集約メソッドを呼び出してカテゴリーを作成
        val updatedCategory = Category.fromDto(
            id = categoryDto.id,
            slug = categoryDto.slug,
            parentId = command.parentId,
            createdAt = categoryDto.createdAt,
            translations = listOf(
                Translation(
                    language = Language.of(command.language),
                    name = command.name,
                    description = command.description
                )
            )
        )

        categoryRepository.update(updatedCategory)
        return updatedCategory.id
    }
}
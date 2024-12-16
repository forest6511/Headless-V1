package com.headblog.backend.app.usecase.category.command.update

import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.shared.exception.AppConflictException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UpdateCategoryService(
    private val categoryRepository: CategoryRepository
) : UpdateCategoryUseCase {

    private val logger = LoggerFactory.getLogger(UpdateCategoryService::class.java)

    override fun execute(command: UpdateCategoryCommand): CategoryId {
        val categoryDto = categoryRepository.findById(command.id)
            ?: throw AppConflictException("Category with ID ${command.id} not found")

        categoryRepository.findBySlug(command.slug)?.let { existingDto ->
            if (existingDto.id != categoryDto.id) {
                throw AppConflictException(
                    "The category with slug '${command.slug}' already exists and belongs to a different category."
                )
            }
        }

        // ドメインの集約メソッドを呼び出してカテゴリーを作成
        val updatedCategory = Category.fromDto(
            id = categoryDto.id,
            name = command.name,
            slug = command.slug,
            description = command.description,
            parentId = command.parentId,
            createdAt = categoryDto.createdAt
        )
        categoryRepository.update(updatedCategory)

        return updatedCategory.id
    }
}
package com.headblog.backend.app.usecase.category.command.update

import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryTranslation
import com.headblog.backend.domain.model.category.admin.CategoryRepository
import com.headblog.backend.domain.model.common.Language
import com.headblog.backend.shared.exceptions.AppConflictException
import java.util.*
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

        // 親カテゴリーIDが指定されている場合は循環参照をチェック
        command.parentId?.let { parentId ->
            // 自分自身を親に設定することはできない
            if (parentId == command.id) {
                throw AppConflictException("Category cannot be its own parent")
            }
            // 親カテゴリーの階層を辿って循環参照をチェック
            checkCircularReference(parentId, command.id)
        }

        val updatedCategory = Category.fromDto(
            id = categoryDto.id,
            slug = categoryDto.slug,
            parentId = command.parentId,
            createdAt = categoryDto.createdAt,
            translations = listOf(
                CategoryTranslation(
                    language = Language.of(command.language),
                    name = command.name,
                    description = command.description
                )
            )
        )

        categoryRepository.update(updatedCategory)
        return updatedCategory.id
    }

    private fun checkCircularReference(parentId: UUID, originalId: UUID) {
        val parentCategory = categoryRepository.findById(parentId)
            ?: throw AppConflictException("Parent category with ID $parentId not found")

        // 親カテゴリーのparentIdが存在する場合、さらに上の階層をチェック
        parentCategory.parentId?.let { grandParentId ->
            // 親の親が元のカテゴリーIDと同じ場合は循環参照
            if (grandParentId == originalId) {
                throw AppConflictException("Circular reference detected in category hierarchy")
            }
            // 再帰的に親の親をチェック
            checkCircularReference(grandParentId, originalId)
        }
    }
}
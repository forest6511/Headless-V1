package com.headblog.backend.app.usecase.category.command.delete

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.Slug
import com.headblog.backend.domain.model.category.Translation
import com.headblog.backend.domain.model.category.admin.CategoryRepository
import com.headblog.backend.domain.model.common.Language
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.shared.exceptions.AppConflictException
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class DeleteCategoryService(
    private val categoryRepository: CategoryRepository,
    private val postCategoryRepository: PostCategoryRepository,
) : DeleteCategoryUseCase {
    private val logger = LoggerFactory.getLogger(javaClass)

    override fun execute(deleteId: UUID): CategoryId {
        val categoryDto = categoryRepository.findById(deleteId)
            ?: throw AppConflictException("Category with ID $deleteId not found")

        // デフォルトカテゴリーの取得（削除禁止の確認）
        val defaultCategory = categoryRepository.findBySlug(Slug.DEFAULT_SLUG)
            ?: throw AppConflictException("Default category not found")

        if (categoryDto.slug == Slug.DEFAULT_SLUG) {
            throw AppConflictException("Cannot delete the default category")
        }

        // 削除対象のカテゴリーを作成
        val deleteCategory = Category.fromDto(
            id = categoryDto.id,
            slug = categoryDto.slug,
            parentId = categoryDto.parentId,
            createdAt = categoryDto.createdAt,
            translations = categoryDto.translations.map {
                Translation(
                    language = Language.of(it.language),
                    name = it.name,
                    description = it.description
                )
            }
        )

        // 削除カテゴリの紐付け対象を変更
        val replacementCategory = if (deleteCategory.parentId == null) {
            // TODO 親カテゴリの場合は、未設定カテゴリへ変更
            defaultCategory
        } else {
            // 親カテゴリが存在する場合は親カテゴリへ変更
            categoryRepository.findById(deleteCategory.parentId.value)
                ?: throw AppConflictException("Parent Category with ID ${deleteCategory.parentId.value} not found")
        }

        // 再帰的に子カテゴリーを処理
        updateChildrenParentRecursively(deleteCategory.id.value, replacementCategory)

        // 投稿との紐付けを解除しデフォルトカテゴリに再割り当て
        val associatedPostIds = postCategoryRepository.findPostsByCategoryId(deleteCategory.id)
        associatedPostIds.forEach { postId ->
            postCategoryRepository.deleteRelation(postId, deleteCategory.id)
            postCategoryRepository.addRelation(postId, CategoryId(replacementCategory.id))
        }

        // カテゴリーの削除
        categoryRepository.delete(deleteCategory)

        return deleteCategory.id
    }

    private fun updateChildrenParentRecursively(currentParentId: UUID, replacementCategory: CategoryDto) {
        // 変更カテゴリーをCategoryオブジェクトに変換
        val category = Category.fromDto(
            id = replacementCategory.id,
            slug = replacementCategory.slug,
            parentId = replacementCategory.parentId,
            createdAt = replacementCategory.createdAt,
            translations = replacementCategory.translations.map {
                Translation(
                    language = Language.of(it.language),
                    name = it.name,
                    description = it.description
                )
            }
        )

        // 現在の親IDを持つ全ての子カテゴリーを取得
        val children = categoryRepository.findAllByParentId(currentParentId).map {
            Category.fromDto(
                id = it.id,
                slug = it.slug,
                parentId = it.parentId,
                createdAt = it.createdAt,
                translations = it.translations.map { translation ->
                    Translation(
                        language = Language.of(translation.language),
                        name = translation.name,
                        description = translation.description
                    )
                }
            )
        }

        children.forEach { child ->
            // 子カテゴリーの親をデフォルトカテゴリーに変更
            val updatedChild = child.updateParent(category)
            categoryRepository.update(updatedChild)

            // この子カテゴリーが持つ子カテゴリーを再帰的に処理
            if (categoryRepository.existsByParentId(child.id.value)) {
                updateChildrenParentRecursively(child.id.value, replacementCategory)
            }
        }
    }
}
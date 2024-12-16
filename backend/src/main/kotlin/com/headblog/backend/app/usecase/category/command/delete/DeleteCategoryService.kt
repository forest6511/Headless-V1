package com.headblog.backend.app.usecase.category.command.delete

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.category.Slug
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.shared.exception.AppConflictException
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

    private val logger = LoggerFactory.getLogger(DeleteCategoryService::class.java)

    override fun execute(command: DeleteCategoryCommand): CategoryId {
        val categoryDto = categoryRepository.findById(command.id)
            ?: throw AppConflictException("Category with ID ${command.id} not found")

        // デフォルトカテゴリーの取得（削除禁止の確認）
        val defaultCategory = categoryRepository.findBySlug(Slug.DEFAULT_SLUG)
            ?: throw AppConflictException("Default category not found")

        if (categoryDto.slug == Slug.DEFAULT_SLUG) {
            throw AppConflictException("Cannot delete the default category")
        }

        // 削除対象のカテゴリーを作成
        val deleteCategory: Category = Category.fromDto(
            id = categoryDto.id,
            name = categoryDto.name,
            slug = categoryDto.slug,
            description = categoryDto.description,
            parentId = categoryDto.parentId,
            createdAt = categoryDto.createdAt
        )

        // 再帰的に子カテゴリーを処理
        updateChildrenParentRecursively(deleteCategory.id.value, defaultCategory)

        // 投稿との紐付けを解除しデフォルトカテゴリに再割り当て
        val associatedPostIds: List<PostId> = postCategoryRepository.findPostsByCategoryId(deleteCategory.id)
        associatedPostIds.forEach { postId ->
            postCategoryRepository.deleteRelation(postId, deleteCategory.id)
            postCategoryRepository.addRelation(postId, CategoryId(defaultCategory.id))
        }

        // カテゴリーの削除
        categoryRepository.delete(deleteCategory)

        return deleteCategory.id
    }

    private fun updateChildrenParentRecursively(currentParentId: UUID, defaultCategory: CategoryDto) {
        // デフォルトカテゴリーをCategoryオブジェクトに変換
        val category = Category.fromDto(
            id = defaultCategory.id,
            name = defaultCategory.name,
            slug = defaultCategory.slug,
            description = defaultCategory.description,
            parentId = defaultCategory.parentId,
            createdAt = defaultCategory.createdAt
        )

        // 現在の親IDを持つ全ての子カテゴリーを取得
        val children = categoryRepository.findAllByParentId(currentParentId)

        children.forEach { child ->
            // 子カテゴリーの親をデフォルトカテゴリーに変更
            val updatedChild = child.updateParent(category)
            categoryRepository.update(updatedChild)  // 更新後のオブジェクトを保存

            // この子カテゴリーが持つ子カテゴリーを再帰的に処理
            if (categoryRepository.existsByParentId(child.id.value)) {
                updateChildrenParentRecursively(child.id.value, defaultCategory)
            }
        }
    }
}
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

    override fun execute(deleteId: UUID): CategoryId {
        val categoryDto = categoryRepository.findById(deleteId)
            ?: throw AppConflictException("Category with ID $deleteId not found")

        // デフォルトカテゴリーの取得（削除禁止の確認）
        val defaultCategory: CategoryDto = categoryRepository.findBySlug(Slug.DEFAULT_SLUG)
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

        // 削除カテゴリの紐付け対象を変更
        // TODO 親カテゴリは存在しない（deleteCategory.parentId == null）が、子カテゴリが存在する場合は、子カテゴリもdeleteCategoryへ
        val replacementCategory: CategoryDto = if (deleteCategory.parentId == null) {
            // 親カテゴリの場合は、未設定カテゴリへ変更
            defaultCategory
        } else {
            // 親カテゴリが存在する場合は親カテゴリへ変更
            categoryRepository.findById(deleteCategory.parentId.value)
                ?: throw AppConflictException("Parent Category with ID ${deleteCategory.parentId.value} not found")
        }

        // 再帰的に子カテゴリーを処理
        updateChildrenParentRecursively(deleteCategory.id.value, replacementCategory)

        // 投稿との紐付けを解除しデフォルトカテゴリに再割り当て
        val associatedPostIds: List<PostId> = postCategoryRepository.findPostsByCategoryId(deleteCategory.id)
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
            name = replacementCategory.name,
            slug = replacementCategory.slug,
            description = replacementCategory.description,
            parentId = replacementCategory.parentId,
            createdAt = replacementCategory.createdAt
        )

        // 現在の親IDを持つ全ての子カテゴリーを取得
        val children = categoryRepository.findAllByParentId(currentParentId)

        children.forEach { child ->
            // 子カテゴリーの親をデフォルトカテゴリーに変更
            val updatedChild = child.updateParent(category)
            categoryRepository.update(updatedChild)  // 更新後のオブジェクトを保存

            // この子カテゴリーが持つ子カテゴリーを再帰的に処理
            if (categoryRepository.existsByParentId(child.id.value)) {
                updateChildrenParentRecursively(child.id.value, replacementCategory)
            }
        }
    }
}
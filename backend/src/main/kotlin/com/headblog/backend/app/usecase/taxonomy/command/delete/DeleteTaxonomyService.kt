package com.headblog.backend.app.usecase.taxonomy.command.delete

import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostTaxonomyRepository
import com.headblog.backend.domain.model.taxonomy.Slug
import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.shared.exception.AppConflictException
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class DeleteTaxonomyService(
    private val taxonomyRepository: TaxonomyRepository,
    private val postTaxonomyRepository: PostTaxonomyRepository,
) : DeleteTaxonomyUseCase {

    private val logger = LoggerFactory.getLogger(DeleteTaxonomyService::class.java)

    override fun execute(command: DeleteTaxonomyCommand): TaxonomyId {
        val taxonomyDto = taxonomyRepository.findById(command.id)
            ?: throw AppConflictException("Taxonomy with ID ${command.id} not found")

        // デフォルトカテゴリーの取得（削除禁止の確認）
        val defaultCategory = taxonomyRepository.findBySlug(Slug.DEFAULT_SLUG)
            ?: throw AppConflictException("Default category not found")

        if (taxonomyDto.slug == Slug.DEFAULT_SLUG) {
            throw AppConflictException("Cannot delete the default category")
        }

        // 削除対象のタクソノミーを作成
        val deleteTaxonomy: Taxonomy = Taxonomy.fromDto(
            id = taxonomyDto.id,
            name = taxonomyDto.name,
            taxonomyType = taxonomyDto.taxonomyType,
            slug = taxonomyDto.slug,
            description = taxonomyDto.description,
            parentId = taxonomyDto.parentId,
            createdAt = taxonomyDto.createdAt
        )

        // 再帰的に子カテゴリーを処理
        updateChildrenParentRecursively(deleteTaxonomy.id.value, defaultCategory)

        // 投稿との紐付けを解除しデフォルトカテゴリに再割り当て
        val associatedPostIds: List<PostId> = postTaxonomyRepository.findPostsByTaxonomyId(deleteTaxonomy.id)
        associatedPostIds.forEach { postId ->
            postTaxonomyRepository.deleteRelation(postId, deleteTaxonomy.id)
            postTaxonomyRepository.addRelation(postId, TaxonomyId(defaultCategory.id))
        }

        // タクソノミーの削除
        taxonomyRepository.delete(deleteTaxonomy)

        return deleteTaxonomy.id
    }

    private fun updateChildrenParentRecursively(currentParentId: UUID, defaultCategory: TaxonomyDto) {
        // デフォルトカテゴリーをTaxonomyオブジェクトに変換
        val defaultTaxonomy = Taxonomy.fromDto(
            id = defaultCategory.id,
            name = defaultCategory.name,
            taxonomyType = defaultCategory.taxonomyType,
            slug = defaultCategory.slug,
            description = defaultCategory.description,
            parentId = defaultCategory.parentId,
            createdAt = defaultCategory.createdAt
        )

        // 現在の親IDを持つ全ての子カテゴリーを取得
        val children = taxonomyRepository.findAllByParentId(currentParentId)

        children.forEach { child ->
            // 子カテゴリーの親をデフォルトカテゴリーに変更
            val updatedChild = child.updateParent(defaultTaxonomy)
            taxonomyRepository.update(updatedChild)  // 更新後のオブジェクトを保存

            // この子カテゴリーが持つ子カテゴリーを再帰的に処理
            if (taxonomyRepository.existsByParentId(child.id.value)) {
                updateChildrenParentRecursively(child.id.value, defaultCategory)
            }
        }
    }
}
package com.headblog.backend.app.usecase.taxonomy.command.delete

import com.headblog.backend.domain.model.taxonomy.Slug
import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import com.headblog.backend.shared.exception.AppConflictException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class DeleteTaxonomyService(
    private val taxonomyRepository: TaxonomyRepository
) : DeleteTaxonomyUseCase {

    private val logger = LoggerFactory.getLogger(DeleteTaxonomyService::class.java)

    override fun execute(command: DeleteTaxonomyCommand): TaxonomyId {
        val taxonomyDto = taxonomyRepository.findById(command.id)
            ?: throw AppConflictException("Taxonomy with ID ${command.id} not found")

        // DEFAULT_SLUGのカテゴリーは削除できない
        if (taxonomyDto.slug == Slug.DEFAULT_SLUG) {
            throw AppConflictException("Cannot delete the default category")
        }

        // 削除対象のタクソノミーを作成
        val deleteTaxonomy = Taxonomy.fromDto(
            id = taxonomyDto.id,
            name = taxonomyDto.name,
            taxonomyType = TaxonomyType.of(taxonomyDto.taxonomyType),
            slug = taxonomyDto.slug,
            description = taxonomyDto.description,
            parentId = taxonomyDto.parentId,
            createdAt = taxonomyDto.createdAt
        )

        // 子カテゴリーが存在する場合の処理
        if (taxonomyRepository.existsByParentId(deleteTaxonomy.id.value)) {
            // デフォルトカテゴリーを取得
            val defaultCategory = taxonomyRepository.findBySlug(Slug.DEFAULT_SLUG)
                ?: throw AppConflictException("Default category not found")

            // 子カテゴリーの親をデフォルトカテゴリーに変更
            taxonomyRepository.updateParentId(
                oldParentId = deleteTaxonomy.id.value,
                newParentId = defaultCategory.id
            )
        }

        // 子カテゴリーが存在する場合の処理
        if (taxonomyRepository.existsByParentId(deleteTaxonomy.id.value)) {
            // デフォルトカテゴリーを取得
            val defaultCategory = taxonomyRepository.findBySlug(Slug.DEFAULT_SLUG)
                ?: throw AppConflictException("Default category not found")

            // 子カテゴリーの親をデフォルトカテゴリーに変更
            taxonomyRepository.updateParentId(
                oldParentId = deleteTaxonomy.id.value,
                newParentId = defaultCategory.id
            )
        }

        taxonomyRepository.delete(deleteTaxonomy)

        return deleteTaxonomy.id
    }
}
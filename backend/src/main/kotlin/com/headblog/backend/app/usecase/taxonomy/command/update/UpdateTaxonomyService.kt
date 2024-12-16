package com.headblog.backend.app.usecase.taxonomy.command.update

import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.CategoryId
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.shared.exception.AppConflictException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UpdateTaxonomyService(
    private val taxonomyRepository: TaxonomyRepository
) : UpdateTaxonomyUseCase {

    private val logger = LoggerFactory.getLogger(UpdateTaxonomyService::class.java)

    override fun execute(command: UpdateTaxonomyCommand): CategoryId {
        val taxonomyDto = taxonomyRepository.findById(command.id)
            ?: throw AppConflictException("Taxonomy with ID ${command.id} not found")

        taxonomyRepository.findBySlug(command.slug)?.let { existingDto ->
            if (existingDto.id != taxonomyDto.id) {
                throw AppConflictException(
                    "The taxonomy with slug '${command.slug}' already exists and belongs to a different taxonomy."
                )
            }
        }

        // ドメインの集約メソッドを呼び出してタクソノミーを作成
        val updatedTaxonomy = Taxonomy.fromDto(
            id = taxonomyDto.id,
            name = command.name,
            slug = command.slug,
            description = command.description,
            parentId = command.parentId,
            createdAt = taxonomyDto.createdAt
        )
        taxonomyRepository.update(updatedTaxonomy)

        return updatedTaxonomy.id
    }
}
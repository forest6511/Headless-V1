package com.headblog.backend.app.usecase.taxonomy.command.create

import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.CategoryId
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.shared.exception.AppConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CreateTaxonomyService(
    private val taxonomyRepository: TaxonomyRepository,
    private val idGenerator: IdGenerator<EntityId>
) : CreateTaxonomyUseCase {

    private val logger = LoggerFactory.getLogger(CreateTaxonomyService::class.java)

    override fun execute(command: CreateTaxonomyCommand): CategoryId {
        taxonomyRepository.findBySlug(command.slug)?.let {
            val message = "The taxonomy with slug '${command.slug}' already exists."
            logger.error(message)
            throw AppConflictException(message)
        }

        // ドメインの集約メソッドを呼び出してタクソノミーを作成
        val taxonomy = Taxonomy.create(
            id = idGenerator,
            name = command.name,
            slug = command.slug,
            description = command.description,
            parentId = command.parentId
        )
        taxonomyRepository.save(taxonomy)

        return taxonomy.id
    }
}


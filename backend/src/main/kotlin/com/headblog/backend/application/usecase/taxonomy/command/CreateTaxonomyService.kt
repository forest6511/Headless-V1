package com.headblog.backend.application.usecase.taxonomy.command

import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CreateTaxonomyService(
    private val taxonomyRepository: TaxonomyRepository,
    private val idGenerator: IdGenerator<EntityId>
) : CreateTaxonomyUseCase {
    override suspend fun execute(command: CreateTaxonomyCommand): TaxonomyId {
        command.parentId?.let { parentId ->
            if (taxonomyRepository.existsByParentId(parentId)) {
                throw ParentTaxonomyHasChildException("The parent taxonomy with ID $parentId already has a child.")
            }
        }
        val taxonomy = Taxonomy.create(
            idGenerator = idGenerator,
            name = command.name,
            taxonomyType = command.taxonomyType,
            slug = command.slug,
            description = command.description,
            parentId = command.parentId
        )
        return taxonomyRepository.save(taxonomy).id
    }
}

class ParentTaxonomyHasChildException(message: String) : RuntimeException(message)

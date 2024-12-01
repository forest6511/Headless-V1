package com.headblog.backend.app.usecase.taxonomy.command

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

    override fun execute(command: CreateTaxonomyCommand): TaxonomyId {
        command.parentId?.let { parentId ->
            if (taxonomyRepository.existsByParentId(parentId)) {
                throw ParentTaxonomyHasChildException("The parent taxonomy with ID $parentId already has a child.")
            }
        }
        // ドメインの集約メソッドを呼び出してタクソノミーを作成
        val taxonomy = Taxonomy.create(
            id = idGenerator,
            name = command.name,
            taxonomyType = command.taxonomyType,
            slug = command.slug,
            description = command.description,
            parentId = command.parentId
        )
        return taxonomyRepository.save(taxonomy).id
    }
}

// TODO: Refactor or review this exception class for better handling and clarity in the future.
class ParentTaxonomyHasChildException(message: String) : RuntimeException(message)

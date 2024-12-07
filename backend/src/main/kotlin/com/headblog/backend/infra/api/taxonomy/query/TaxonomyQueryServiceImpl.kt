package com.headblog.backend.infra.api.taxonomy.query

import com.headblog.backend.app.usecase.taxonomy.query.GetTaxonomyQueryService
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import java.util.*
import org.springframework.stereotype.Service

@Service
class TaxonomyQueryServiceImpl(
    private val taxonomyRepository: TaxonomyRepository
) : GetTaxonomyQueryService {

    override fun findById(id: UUID): TaxonomyDto? = taxonomyRepository.findById(id)

    override fun findBySlug(slug: String): TaxonomyDto? = taxonomyRepository.findBySlug(slug)

    override fun findByType(type: TaxonomyType): List<TaxonomyDto> = taxonomyRepository.findByType(type)

    override fun existsByParentId(parentId: UUID) = taxonomyRepository.existsByParentId(parentId)

    override fun findTypeWithPostRefs(type: TaxonomyType) = taxonomyRepository.findTypeWithPostRefs(type)
}
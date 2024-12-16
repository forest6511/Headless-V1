package com.headblog.backend.infra.api.taxonomy.query

import com.headblog.backend.app.usecase.taxonomy.query.BreadcrumbDto
import com.headblog.backend.app.usecase.taxonomy.query.GetTaxonomyQueryService
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyListDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyWithPostRefsDto
import com.headblog.backend.domain.model.taxonomy.Slug
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import java.util.*
import org.springframework.stereotype.Service

@Service
class TaxonomyQueryServiceImpl(
    private val taxonomyRepository: TaxonomyRepository
) : GetTaxonomyQueryService {

    override fun findById(id: UUID): TaxonomyDto? = taxonomyRepository.findById(id)

    override fun findBySlug(slug: String): TaxonomyDto? = taxonomyRepository.findBySlug(slug)

    override fun existsByParentId(parentId: UUID) = taxonomyRepository.existsByParentId(parentId)

    override fun findTaxonomyList(): List<TaxonomyListDto> {
        val taxonomyWithPostRefsDto: List<TaxonomyWithPostRefsDto> = taxonomyRepository.findTypeWithPostRefs()
        val taxonomyMap = taxonomyWithPostRefsDto.associateBy { it.id }

        val categoryList = taxonomyWithPostRefsDto.map { taxonomy ->
            TaxonomyListDto(
                id = taxonomy.id,
                name = taxonomy.name,
                slug = taxonomy.slug,
                description = taxonomy.description,
                parentId = taxonomy.parentId,
                createdAt = taxonomy.createdAt,
                postIds = taxonomy.postIds,
                breadcrumbs = generateBreadcrumbs(taxonomy, taxonomyMap)
            )
        }
        return categoryList.sortedWith(compareBy(
            { it.slug != Slug.DEFAULT_SLUG },  // 1. "未設定" (DEFAULT_SLUG) のカテゴリを最初に
            { it.parentId != null },           // 2. "parentId" が NULL のカテゴリを次に
            { it.parentId }                    // 3. "parentId" の昇順で並べる
        ))
    }

    private fun generateBreadcrumbs(
        taxonomy: TaxonomyWithPostRefsDto,
        taxonomyMap: Map<UUID, TaxonomyWithPostRefsDto>
    ): List<BreadcrumbDto> {
        return generateSequence(taxonomy) { current ->
            current.parentId?.let { taxonomyMap[it] } // 親カテゴリを取得
        }.map { current ->
            BreadcrumbDto(
                id = current.id,
                name = current.name,
                slug = current.slug
            )
        }.toList().reversed()
    }
}
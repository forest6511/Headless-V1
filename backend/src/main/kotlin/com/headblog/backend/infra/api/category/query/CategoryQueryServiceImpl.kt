package com.headblog.backend.infra.api.category.query

import com.headblog.backend.app.usecase.category.query.BreadcrumbDto
import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryListDto
import com.headblog.backend.app.usecase.category.query.CategoryWithPostRefsDto
import com.headblog.backend.app.usecase.category.query.GetCategoryQueryService
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.category.Slug
import java.util.*
import org.springframework.stereotype.Service

@Service
class CategoryQueryServiceImpl(
    private val categoryRepository: CategoryRepository
) : GetCategoryQueryService {

    override fun findById(id: UUID): CategoryDto? = categoryRepository.findById(id)

    override fun findBySlug(slug: String): CategoryDto? = categoryRepository.findBySlug(slug)

    override fun existsByParentId(parentId: UUID) = categoryRepository.existsByParentId(parentId)

    override fun findTaxonomyList(): List<CategoryListDto> {
        val taxonomyWithPostRefsDto: List<CategoryWithPostRefsDto> = categoryRepository.findTypeWithPostRefs()
        val taxonomyMap = taxonomyWithPostRefsDto.associateBy { it.id }

        val categoryList = taxonomyWithPostRefsDto.map { taxonomy ->
            CategoryListDto(
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
        taxonomy: CategoryWithPostRefsDto,
        taxonomyMap: Map<UUID, CategoryWithPostRefsDto>
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
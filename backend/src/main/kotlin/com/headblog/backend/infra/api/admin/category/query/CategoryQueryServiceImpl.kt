package com.headblog.backend.infra.api.admin.category.query

import com.headblog.backend.app.usecase.category.query.BreadcrumbDto
import com.headblog.backend.app.usecase.category.query.BreadcrumbTranslationDto
import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryListDto
import com.headblog.backend.app.usecase.category.query.CategoryWithPostIdsDto
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

    override fun findCategoryList(): List<CategoryListDto> {
        val categoryWithPostIdsDto = categoryRepository.findWithPostIds()
        val categoryMap = categoryWithPostIdsDto.associateBy { it.id }

        val categoryList = categoryWithPostIdsDto.map { category ->
            CategoryListDto(
                id = category.id,
                slug = category.slug,
                parentId = category.parentId,
                translations = category.translations,
                createdAt = category.createdAt,
                postIds = category.postIds,
                breadcrumbs = generateBreadcrumbs(category, categoryMap)
            )
        }
        return categoryList.sortedWith(
            compareBy(
                { it.slug != Slug.DEFAULT_SLUG },   // 1. "未設定" (DEFAULT_SLUG) のカテゴリを最初に
            { it.breadcrumbs.first().id },      // 2. パンくずの親カテゴリ順
            { it.parentId }                     // 3. 子カテゴリが存在しないカテゴリを最初に
        ))
    }

    private fun generateBreadcrumbs(
        category: CategoryWithPostIdsDto,
        categoryMap: Map<UUID, CategoryWithPostIdsDto>
    ): List<BreadcrumbDto> {
        return generateSequence(category) { current ->
            current.parentId?.let { categoryMap[it] }
        }.map { current ->
            BreadcrumbDto(
                id = current.id,
                slug = current.slug,
                translations = current.translations.map { translation ->
                    BreadcrumbTranslationDto(
                        language = translation.language,
                        name = translation.name
                    )
                }
            )
        }.toList().reversed()
    }
}
package com.headblog.backend.infra.api.client.category.query

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.client.qeury.GetClientCategoryQueryService
import com.headblog.backend.domain.model.category.Slug
import com.headblog.backend.domain.model.category.admin.CategoryRepository
import com.headblog.backend.infra.api.client.category.response.HierarchicalCategoryResponse
import com.headblog.backend.shared.exceptions.AppConflictException
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service

@Service
class GetClientCategoryQueryServiceImpl(
    private val categoryRepository: CategoryRepository,
) : GetClientCategoryQueryService {
    @Cacheable("categories")
    override fun getHierarchicalCategories(language: String): List<HierarchicalCategoryResponse> {
        val allCategories = categoryRepository.findAll()

        // 未設定カテゴリーを最初に配置し、他のルートカテゴリーをソート
        val rootCategories = allCategories.filter { it.parentId == null }
            .sortedBy { category ->
                when (category.slug) {
                    Slug.DEFAULT_SLUG -> 0  // 未設定を最初に
                    else -> 1               // その他のカテゴリー
                }
            }

        return rootCategories.map { root ->
            buildCategoryHierarchy(root, allCategories, "", language)
        }
    }

    private fun buildCategoryHierarchy(
        category: CategoryDto,
        allCategories: List<CategoryDto>,
        parentPath: String,
        language: String
    ): HierarchicalCategoryResponse {
        val currentPath = if (parentPath.isEmpty()) category.slug else "$parentPath/${category.slug}"

        val translation = category.translations.find { it.language == language }
            ?: category.translations.firstOrNull()
            ?: throw AppConflictException("No translation found for category: ${category.id}")

        val children = allCategories
            .filter { it.parentId == category.id }
            .map { child -> buildCategoryHierarchy(child, allCategories, currentPath, language) }

        return HierarchicalCategoryResponse(
            id = category.id,
            slug = category.slug,
            name = translation.name,
            description = translation.description,
            children = children,
            fullPath = currentPath
        )
    }
}
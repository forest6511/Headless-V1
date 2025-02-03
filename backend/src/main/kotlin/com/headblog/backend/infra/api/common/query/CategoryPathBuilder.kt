package com.headblog.backend.infra.api.common.query

import com.headblog.backend.domain.model.category.admin.CategoryRepository
import com.headblog.backend.infra.api.client.post.response.CategoryPathDto
import java.util.*
import org.springframework.stereotype.Component

@Component
class CategoryPathBuilder(
    private val categoryRepository: CategoryRepository
) {
    fun buildPath(categoryId: UUID, language: String): List<CategoryPathDto> =
        generateSequence(categoryId) { currentId ->
            categoryRepository.findByIdAndLanguage(currentId, language)?.parentId
        }
            .mapNotNull { id ->
                categoryRepository.findByIdAndLanguage(id, language)?.let { category ->
                    CategoryPathDto(
                        slug = category.slug,
                        name = category.translations.first().name,
                        description = category.translations.first().description,
                    )
                }
            }
            .toList()
            .reversed()
}
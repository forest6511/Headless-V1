package com.headblog.backend.domain.model.category

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryWithPostIdsDto
import java.util.*

interface CategoryRepository {
    fun save(category: Category): Int
    fun update(category: Category): Int
    fun delete(category: Category): Int
    fun updateParentId(oldParentId: UUID, newParentId: UUID): Int

    fun findById(id: UUID): CategoryDto?
    fun findBySlug(slug: String): CategoryDto?
    fun existsByParentId(parentId: UUID): Boolean
    fun findWithPostIds(): List<CategoryWithPostIdsDto>
    fun findAllByParentId(parentId: UUID): List<CategoryDto>
    fun findByIdAndLanguage(id: UUID, language: String): CategoryDto?

}
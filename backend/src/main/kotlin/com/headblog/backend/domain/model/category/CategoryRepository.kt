package com.headblog.backend.domain.model.category

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryWithPostIdsDto
import com.headblog.backend.app.usecase.post.query.PostDto
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
    fun findAll(): List<CategoryDto>

    // 特定のカテゴリの記事を取得
    fun findPublishedPostsByCategorySlug(
        slug: String,
        language: String,
        pageSize: Int
    ): List<PostDto>

    // 親カテゴリとその子カテゴリの記事を取得
    fun findPublishedPostsByParentCategorySlug(
        parentSlug: String,
        language: String,
        pageSize: Int
    ): List<PostDto>

    // カテゴリパスから特定のカテゴリを取得
    fun findCategoryByPath(
        slugs: List<String>,
        language: String
    ): CategoryDto?
}
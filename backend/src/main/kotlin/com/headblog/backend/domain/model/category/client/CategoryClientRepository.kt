package com.headblog.backend.domain.model.category.client

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.post.PostDto
import java.util.*

interface CategoryClientRepository {
    fun findByIdAndLanguage(id: UUID, language: String): CategoryDto?

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
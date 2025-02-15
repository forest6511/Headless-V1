package com.headblog.backend.app.usecase.category.client.qeury

import com.headblog.backend.infra.api.client.category.response.CategoryWithArticlesClientResponse

interface GetClientCategoryArticlesQueryService {
    fun getCategoryArticles(
        categoryPath: String,
        language: String,
        pageSize: Int
    ): CategoryWithArticlesClientResponse
}
package com.headblog.backend.app.usecase.category.client.qeury

import com.headblog.backend.infra.api.client.category.response.HierarchicalCategoryResponse

interface GetClientCategoryQueryService {
    fun getHierarchicalCategories(language: String): List<HierarchicalCategoryResponse>
}
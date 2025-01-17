package com.headblog.backend.infra.api.client.category.response

import java.util.*

data class HierarchicalCategoryResponse(
    val id: UUID,
    val slug: String,
    val name: String,
    val description: String?,
    val children: List<HierarchicalCategoryResponse>,
    val fullPath: String
)

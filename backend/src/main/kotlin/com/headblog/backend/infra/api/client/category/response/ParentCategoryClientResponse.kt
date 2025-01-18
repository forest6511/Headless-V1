package com.headblog.backend.infra.api.client.category.response

import java.util.*

data class ParentCategoryClientResponse(
    val id: UUID,
    val slug: String,
    val name: String,
    val description: String?
)
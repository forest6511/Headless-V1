package com.headblog.backend.infra.api.admin.category.request

import jakarta.validation.constraints.NotNull
import java.util.*

data class DeleteCategoryRequest(
    @field:NotNull(message = "ID is required")
    val id: UUID,
)

package com.headblog.backend.infra.api.admin.category.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.util.*

data class UpdateCategoryRequest(
    @field:NotNull(message = "ID is required")
    val id: UUID,

    @field:NotBlank(message = "Language is required")
    @field:Size(max = 5, message = "Language must be less than 5 characters")
    val language: String = "ja",

    @field:NotBlank(message = "Name is required")
    @field:Size(max = 255, message = "Name must be less than 255 characters")
    val name: String,

    @field:Size(max = 1000, message = "Description must be less than 1000 characters")
    val description: String?,

    val parentId: UUID?
)

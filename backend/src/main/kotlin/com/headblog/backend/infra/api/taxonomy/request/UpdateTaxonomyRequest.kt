package com.headblog.backend.infra.api.taxonomy.request

import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.util.*

data class UpdateTaxonomyRequest(
    @field:NotNull(message = "ID is required")
    val id: UUID,

    @field:NotBlank(message = "Name is required")
    @field:Size(max = 255, message = "Name must be less than 255 characters")
    val name: String,

    @field:NotNull(message = "Type is required")
    val type: TaxonomyType,

    @field:NotBlank(message = "Slug is required")
    @field:Size(max = 255, message = "Slug must be less than 255 characters")
    @field:Pattern(
        regexp = "^[a-z0-9-_]+$",
        message = "Slug must contain only lowercase letters, numbers, hyphens, and underscores"
    )
    val slug: String,

    @field:Size(max = 1000, message = "Description must be less than 1000 characters")
    val description: String?,

    val parentId: UUID?
)

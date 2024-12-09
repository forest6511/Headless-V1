package com.headblog.backend.infra.api.taxonomy.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.util.*

data class CreateTaxonomyRequest(
    @field:NotBlank(message = "Name is required")
    @field:Size(max = 255, message = "Name must be less than 255 characters")
    val name: String,

    @field:NotNull(message = "Type is required")
    val type: String,

    @field:NotBlank(message = "Slug is required")
    @field:Size(max = 255, message = "Slug must be less than 255 characters")
    @field:Pattern(
        regexp = "^[a-z0-9-_]+$",
        message = "Slug must contain only lowercase letters, numbers, hyphens, and underscores"
    )
    val slug: String,

    @field:Size(max = 1000, message = "Description must be less than 1000 characters")
    val description: String?,

    // Requestクラスでは、外部システムとの通信を簡潔に保つために、ValueObjectは使用しません
    // UUIDはドメイン層でValueObjectに変換します
    val parentId: UUID?
)

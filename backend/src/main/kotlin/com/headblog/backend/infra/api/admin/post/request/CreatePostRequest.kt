package com.headblog.backend.infra.api.admin.post.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.util.*

data class CreatePostRequest(

    @field:NotBlank(message = "Language is required")
    @field:Size(max = 5, message = "Language must be less than 5 characters")
    val language: String = "ja",

    @field:NotBlank(message = "Title is required")
    @field:Size(max = 255, message = "Title must be less than 255 characters")
    val title: String,

    @field:NotBlank(message = "Slug is required")
    @field:Size(max = 255, message = "Slug must be less than 255 characters")
    @field:Pattern(
        regexp = "^[a-z0-9-_]+$",
        message = "Slug must contain only lowercase letters, numbers, hyphens, and underscores"
    )
    val slug: String,

    @field:NotBlank(message = "Content is required")
    val content: String,

    @field:NotBlank(message = "Excerpt is required")
    @field:Size(max = 100, message = "Excerpt must be less than 100 characters")
    val excerpt: String,

    @field:NotBlank(message = "Status is required")
    @field:Size(max = 50, message = "Status must be less than 50 characters")
    val status: String,

    val featuredImageId: UUID?,

    @field:NotNull(message = "Category id is required")
    val categoryId: UUID,

    val tagNames: Set<String> = emptySet(),
)
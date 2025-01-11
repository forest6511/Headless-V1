package com.headblog.backend.infra.api.admin.category.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.*

data class CreateCategoryRequest(
    @field:NotBlank(message = "Language is required")
    @field:Size(max = 5, message = "Language must be less than 5 characters")
    val language: String = "ja",

    @field:NotBlank(message = "Name is required")
    @field:Size(max = 255, message = "Name must be less than 255 characters")
    val name: String,

    @field:Size(max = 1000, message = "Description must be less than 1000 characters")
    val description: String?,

    // Requestクラスでは、外部システムとの通信を簡潔に保つために、ValueObjectは使用しません
    // UUIDはドメイン層でValueObjectに変換します
    val parentId: UUID?
)

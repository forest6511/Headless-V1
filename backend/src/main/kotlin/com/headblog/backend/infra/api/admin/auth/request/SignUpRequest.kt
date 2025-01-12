package com.headblog.backend.infra.api.admin.auth.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class SignUpRequest(
    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Invalid email format")
    val email: String,

    @field:NotBlank(message = "Password is required")
    @field:Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters")
    val password: String,

    @field:NotBlank(message = "Nickname is required")
    @field:Size(min = 3, max = 50, message = "Nickname must be between 3 and 50 characters")
    val nickname: String,

    @field:NotBlank(message = "Default language is required")
    @field:Pattern(regexp = "^(en|ja)$", message = "Default language must be 'en' or 'ja'")
    val language: String,
)
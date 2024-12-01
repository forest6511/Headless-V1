package com.headblog.backend.app.usecase.auth.query

import com.headblog.backend.domain.model.user.UserId
import java.time.LocalDateTime

data class UserDto(
    val id: UserId,
    val email: String,
    val role: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
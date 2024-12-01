package com.headblog.backend.app.usecase.auth.query

import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.UserId

interface GetUserQueryService {
    suspend fun findByEmail(email: Email): UserDto?
    suspend fun findById(id: UserId): UserDto?
}
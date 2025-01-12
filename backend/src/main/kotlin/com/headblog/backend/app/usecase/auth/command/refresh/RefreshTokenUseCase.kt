package com.headblog.backend.app.usecase.auth.command.refresh

import com.headblog.backend.infra.api.admin.auth.response.RefreshTokenResponse

interface RefreshTokenUseCase {
    fun execute(command: RefreshTokenCommand): RefreshTokenResponse
}
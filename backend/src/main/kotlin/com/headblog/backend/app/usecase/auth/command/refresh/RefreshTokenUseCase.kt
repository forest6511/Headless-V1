package com.headblog.backend.app.usecase.auth.command.refresh

interface RefreshTokenUseCase {
    fun execute(command: RefreshTokenCommand): RefreshTokenResponse
}
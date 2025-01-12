package com.headblog.backend.app.usecase.auth.command.signin

import com.headblog.backend.infra.api.admin.auth.response.SignInResponse

interface SignInUseCase {
    fun execute(command: SignInCommand): SignInResponse
}
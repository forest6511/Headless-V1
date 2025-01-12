package com.headblog.backend.app.usecase.auth.command.signup

import com.headblog.backend.infra.api.admin.auth.response.SignUpResponse

interface SignUpUseCase {
    fun execute(command: SignUpCommand): SignUpResponse
}
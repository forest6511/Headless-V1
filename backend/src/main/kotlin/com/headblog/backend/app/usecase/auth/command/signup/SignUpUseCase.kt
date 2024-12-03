package com.headblog.backend.app.usecase.auth.command.signup

interface SignUpUseCase {
    fun execute(command: SignUpCommand): SignUpResponse
}
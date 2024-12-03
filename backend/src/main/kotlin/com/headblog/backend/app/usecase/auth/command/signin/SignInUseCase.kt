package com.headblog.backend.app.usecase.auth.command.signin

interface SignInUseCase {
    fun execute(command: SignInCommand): SignInResponse
}
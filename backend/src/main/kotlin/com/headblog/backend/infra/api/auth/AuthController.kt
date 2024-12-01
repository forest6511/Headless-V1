package com.headblog.backend.infra.api.auth

import com.headblog.backend.app.usecase.auth.command.signin.SignInCommand
import com.headblog.backend.app.usecase.auth.command.signin.SignInRequest
import com.headblog.backend.app.usecase.auth.command.signin.SignInResult
import com.headblog.backend.app.usecase.auth.command.signin.SignInUseCase
import com.headblog.backend.app.usecase.auth.command.signup.SignUpCommand
import com.headblog.backend.app.usecase.auth.command.signup.SignUpResult
import com.headblog.backend.app.usecase.auth.command.signup.SignUpUseCase
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.infra.api.auth.request.SignUpRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val signUpUseCase: SignUpUseCase,
    private val signInUseCase: SignInUseCase
) {

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    fun signUp(@Valid @RequestBody request: SignUpRequest): SignUpResult {
        val command = request.toCommand()
        return signUpUseCase.execute(command)
    }

    @PostMapping("/signin")
    fun signIn(@Valid @RequestBody request: SignInRequest): SignInResult {
        val command = request.toCommand()
        return signInUseCase.execute(command)
    }

    // toCommand メソッド
    private fun SignUpRequest.toCommand(): SignUpCommand {
        return SignUpCommand(
            email = Email.of(this.email),
            password = this.password
        )
    }

    private fun SignInRequest.toCommand(): SignInCommand {
        return SignInCommand(
            email = Email.of(this.email),
            password = this.password
        )
    }
}

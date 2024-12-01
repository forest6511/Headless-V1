package com.headblog.backend.infra.api.auth

import com.headblog.backend.app.service.RefreshTokenService
import com.headblog.backend.app.usecase.auth.command.signin.SignInCommand
import com.headblog.backend.app.usecase.auth.command.signin.SignInRequest
import com.headblog.backend.app.usecase.auth.command.signin.SignInResult
import com.headblog.backend.app.usecase.auth.command.signin.SignInUseCase
import com.headblog.backend.app.usecase.auth.command.signup.SignUpCommand
import com.headblog.backend.app.usecase.auth.command.signup.SignUpResult
import com.headblog.backend.app.usecase.auth.command.signup.SignUpUseCase
import com.headblog.backend.domain.model.auth.JwtAuthenticationResult
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.infra.api.auth.request.SignUpRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val signUpUseCase: SignUpUseCase,
    private val signInUseCase: SignInUseCase,
    private val refreshTokenService: RefreshTokenService
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

    @PostMapping("/refresh")
    fun refreshToken(@RequestParam refreshToken: String): JwtAuthenticationResult {
        return refreshTokenService.refresh(refreshToken)
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

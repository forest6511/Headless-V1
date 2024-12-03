package com.headblog.backend.infra.api.auth

import com.headblog.backend.app.usecase.auth.command.refresh.RefreshTokenCommand
import com.headblog.backend.app.usecase.auth.command.refresh.RefreshTokenResponse
import com.headblog.backend.app.usecase.auth.command.refresh.RefreshTokenUseCase
import com.headblog.backend.app.usecase.auth.command.signin.SignInCommand
import com.headblog.backend.app.usecase.auth.command.signin.SignInResponse
import com.headblog.backend.app.usecase.auth.command.signin.SignInUseCase
import com.headblog.backend.app.usecase.auth.command.signup.SignUpCommand
import com.headblog.backend.app.usecase.auth.command.signup.SignUpResponse
import com.headblog.backend.app.usecase.auth.command.signup.SignUpUseCase
import com.headblog.backend.domain.model.auth.JwtToken
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.infra.api.auth.handler.AuthenticationResponseHandler
import com.headblog.backend.infra.api.auth.request.RefreshTokenRequest
import com.headblog.backend.infra.api.auth.request.SignInRequest
import com.headblog.backend.infra.api.auth.request.SignUpRequest
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val signUpUseCase: SignUpUseCase,
    private val signInUseCase: SignInUseCase,
    private val refreshTokenUseCase: RefreshTokenUseCase,
    private val authenticationResponseHandler: AuthenticationResponseHandler,
) {

    @PostMapping("/signup")
    fun signUp(@Valid @RequestBody request: SignUpRequest): ResponseEntity<SignUpResponse> {
        val result = signUpUseCase.execute(request.toCommand())
        return authenticationResponseHandler.handle(result)
    }

    @PostMapping("/signin")
    fun signIn(@Valid @RequestBody request: SignInRequest): ResponseEntity<SignInResponse> {
        val result = signInUseCase.execute(request.toCommand())
        return authenticationResponseHandler.handle(result)
    }

    @PostMapping("/refresh")
    fun refreshToken(
        @RequestBody request: RefreshTokenRequest
    ): ResponseEntity<RefreshTokenResponse> {
        val result = refreshTokenUseCase.execute(request.toCommand())
        return authenticationResponseHandler.handle(result)
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

    private fun RefreshTokenRequest.toCommand(): RefreshTokenCommand {
        return RefreshTokenCommand(
            jwtToken = JwtToken.of(this.refreshToken),
        )
    }
}
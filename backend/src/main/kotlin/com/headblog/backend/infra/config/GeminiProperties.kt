package com.headblog.backend.infra.config

import jakarta.validation.constraints.NotBlank
import java.time.Duration
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated

@ConfigurationProperties(prefix = "gemini")
data class GeminiProperties(
    val api: ApiConfig,
    val timeout: TimeoutConfig = TimeoutConfig()
) {
    @Validated
    data class ApiConfig(
        @field:NotBlank
        val url: String,
        @field:NotBlank
        val key: String
    )

    data class TimeoutConfig(
        val connect: Duration = Duration.ofSeconds(60),
        val request: Duration = Duration.ofSeconds(120)
    )
}
package com.headblog.backend.infra.config

import com.headblog.backend.infra.service.translation.GeminiClient
import java.net.http.HttpClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class GeminiConfig {
    @Value("\${gemini.api.key}")
    private lateinit var apiKey: String

    @Bean
    fun httpClient(): HttpClient = HttpClient.newHttpClient()

    @Bean
    fun geminiClient(httpClient: HttpClient): GeminiClient {
        return GeminiClient(apiKey, httpClient)
    }
}
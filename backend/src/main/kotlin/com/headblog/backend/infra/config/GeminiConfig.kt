package com.headblog.backend.infra.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.headblog.backend.domain.model.quota.QuotaManagementService
import com.headblog.backend.infra.service.translation.GeminiClient
import java.net.http.HttpClient
import java.util.concurrent.Executors
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(GeminiProperties::class)
class GeminiConfig {

    @Bean
    fun httpClient(properties: GeminiProperties): HttpClient {
        return HttpClient.newBuilder()
            .connectTimeout(properties.timeout.connect)
            .followRedirects(HttpClient.Redirect.NORMAL)
            .version(HttpClient.Version.HTTP_2)
            .executor(Executors.newFixedThreadPool(5))
            .build()
    }

    @Bean
    fun geminiClient(
        properties: GeminiProperties,
        httpClient: HttpClient,
        objectMapper: ObjectMapper,
        quotaManagementService: QuotaManagementService
    ): GeminiClient {
        return GeminiClient(
            apiKey = properties.api.key,
            apiUrl = properties.api.url,
            httpClient = httpClient,
            requestTimeout = properties.timeout.request,
            quotaManagementService = quotaManagementService
        )
    }
}
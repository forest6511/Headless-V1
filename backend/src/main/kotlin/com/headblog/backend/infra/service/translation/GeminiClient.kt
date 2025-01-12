package com.headblog.backend.infra.service.translation

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.headblog.backend.domain.model.quota.QuotaManagementService
import com.headblog.backend.shared.exceptions.AppConflictException
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Duration
import org.slf4j.LoggerFactory

class GeminiClient(
    private val apiKey: String,
    private val apiUrl: String,
    private val httpClient: HttpClient,
    private val requestTimeout: Duration,
    private val quotaManagementService: QuotaManagementService
) {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val objectMapper = jacksonObjectMapper()
    fun generateContent(prompt: String): Result<String> = runCatching {
        val request = createRequest(prompt, requestTimeout)
        val response = executeRequest(request)
        parseResponse(response)
    }

    private fun createRequest(prompt: String, timeout: Duration): HttpRequest {
        // クォータチェックを追加
        quotaManagementService.checkAndIncrementQuota("gemini")

        val escapedPrompt = escapePrompt(prompt)
        val requestBody = createRequestBody(escapedPrompt)
        logger.debug("Request body: $requestBody")

        return HttpRequest.newBuilder()
            .uri(URI.create("$apiUrl?key=$apiKey"))
            .header("Content-Type", "application/json")
            .timeout(timeout)  // タイムアウトを設定
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build()
    }

    private fun escapePrompt(prompt: String): String =
        prompt.replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t")

    private fun createRequestBody(escapedPrompt: String): String =
        """
        {
            "contents": [{
                "parts": [{
                    "text": "$escapedPrompt"
                }]
            }]
        }
        """.trimIndent()

    private fun executeRequest(request: HttpRequest): HttpResponse<String> {
        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())

        if (response.statusCode() != 200) {
            logger.error("API request failed with status code: ${response.statusCode()}")
            throw AppConflictException(
                message = "API request failed: status=${response.statusCode()}, body=${response.body()}"
            )
        }

        return response
    }

    private fun parseResponse(response: HttpResponse<String>): String {
        logger.debug("Response body: ${response.body()}")
        return extractTextFromResponse(objectMapper.readValue(response.body(), Map::class.java))
            ?: throw AppConflictException("Failed to extract text from response")
    }

    private fun extractTextFromResponse(response: Map<*, *>?): String? {
        @Suppress("UNCHECKED_CAST")
        return (response?.get("candidates") as? List<Map<String, Any>>)
            ?.firstOrNull()
            ?.let { candidate ->
                (candidate["content"] as? Map<String, Any>)
                    ?.let { content ->
                        ((content["parts"] as? List<Map<String, Any>>)
                            ?.firstOrNull()
                            ?.get("text") as? String)
                    }
            }
    }
}
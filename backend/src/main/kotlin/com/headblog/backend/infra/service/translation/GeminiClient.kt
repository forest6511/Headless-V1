package com.headblog.backend.infra.service.translation

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.net.URI
import org.slf4j.LoggerFactory

class GeminiClient(
    private val apiKey: String,
    private val httpClient: HttpClient = HttpClient.newHttpClient()
) {
    private val logger = LoggerFactory.getLogger(GeminiClient::class.java)
    private val baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    private val objectMapper = jacksonObjectMapper()

    fun generateContent(prompt: String): Result<String> = runCatching {
        logger.debug("Sending request to Gemini API")

        // プロンプトのエスケープ処理を追加
        val escapedPrompt = prompt.replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t")

        val requestBody = """
            {
                "contents": [{
                    "parts": [{
                        "text": "$escapedPrompt"
                    }]
                }]
            }
        """.trimIndent()

        logger.debug("Request body: $requestBody")

        val request = HttpRequest.newBuilder()
            .uri(URI.create("$baseUrl?key=$apiKey"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build()

        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())

        if (response.statusCode() != 200) {
            logger.error("API request failed with status code: ${response.statusCode()}")
            logger.error("Response body: ${response.body()}")
            throw RuntimeException("API request failed: status=${response.statusCode()}, body=${response.body()}")
        }

        val responseBody = response.body()
        logger.debug("Response body: $responseBody")

        extractTextFromResponse(objectMapper.readValue(responseBody, Map::class.java))
            ?: throw RuntimeException("Failed to extract text from response")
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
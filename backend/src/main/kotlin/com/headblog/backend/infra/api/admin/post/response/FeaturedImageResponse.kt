package com.headblog.backend.infra.api.admin.post.response

import com.headblog.backend.infra.api.admin.media.response.MediaTranslationResponse
import java.util.*

data class FeaturedImageResponse(
    val id: UUID,
    val thumbnailUrl: String,
    val mediumUrl: String,
    // media.response.TranslationResponse
    val translations: List<MediaTranslationResponse>
)

fun FeaturedImageResponse.withFullUrls(mediaBaseUrl: String): FeaturedImageResponse {
    return copy(
        thumbnailUrl = thumbnailUrl.prependBaseUrl(mediaBaseUrl),
        mediumUrl = mediumUrl.prependBaseUrl(mediaBaseUrl)
    )
}

private fun String.prependBaseUrl(baseUrl: String): String {
    return "$baseUrl/$this"
}
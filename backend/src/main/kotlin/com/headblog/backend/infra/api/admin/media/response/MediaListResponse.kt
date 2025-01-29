package com.headblog.backend.infra.api.admin.media.response

data class MediaListResponse(
    val media: List<MediaResponse>
)

fun MediaResponse.withFullUrls(mediaBaseUrl: String): MediaResponse {
    return copy(
        thumbnailUrl = thumbnailUrl.prependBaseUrl(mediaBaseUrl),
        mediumUrl = mediumUrl.prependBaseUrl(mediaBaseUrl)
    )
}

private fun String.prependBaseUrl(baseUrl: String): String {
    return "$baseUrl/$this"
}
package com.headblog.backend.app.usecase.media.query

import com.headblog.backend.infra.api.admin.media.response.MediaListResponse
import java.util.*

interface GetMediaService {
    fun findMediaList(mediaId: UUID?, userId: UUID?, pageSize: Int = 20): MediaListResponse
}
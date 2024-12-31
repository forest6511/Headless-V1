package com.headblog.backend.domain.model.media

import com.headblog.backend.app.usecase.media.query.MediaDto
import com.headblog.backend.domain.model.user.UserId

interface MediaRepository {
    fun save(media: Media): Int
    fun update(media: Media): Int
    fun delete(media: Media): Int

    fun findAll(
        cursorMediaId: MediaId?,
        uploadedBy: UserId?,
        pageSize: Int,
    ): List<MediaDto>

    fun count(uploadedBy: UserId?): Int
}
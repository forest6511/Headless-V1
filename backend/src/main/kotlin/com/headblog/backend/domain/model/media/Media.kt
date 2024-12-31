package com.headblog.backend.domain.model.media

import com.headblog.backend.domain.model.user.UserId
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator

class Media private constructor(
    val id: MediaId,
    val title: String?,
    val altText: String?,
    val uploadedBy: UserId,
    val thumbnail: MediaSize,
    val small: MediaSize,
    val medium: MediaSize
) {
    companion object {
        fun create(
            idGenerator: IdGenerator<EntityId>,
            title: String?,
            altText: String?,
            uploadedBy: UserId,
            thumbnail: MediaSize,
            small: MediaSize,
            medium: MediaSize
        ): Media {
            return Media(
                id = MediaId(idGenerator.generate().value),
                title = title,
                altText = altText,
                uploadedBy = uploadedBy,
                thumbnail = thumbnail,
                small = small,
                medium = medium
            )
        }

        fun createWithId(
            id: MediaId,
            title: String?,
            altText: String?,
            uploadedBy: UserId,
            thumbnail: MediaSize,
            small: MediaSize,
            medium: MediaSize
        ): Media {
            return Media(
                id = id,
                title = title,
                altText = altText,
                uploadedBy = uploadedBy,
                thumbnail = thumbnail,
                small = small,
                medium = medium
            )
        }
    }
}
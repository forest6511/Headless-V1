package com.headblog.backend.domain.model.media

import com.headblog.backend.domain.model.user.UserId
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator

class Media private constructor(
    val id: MediaId,
    val uploadedBy: UserId,
    val thumbnail: MediaSize,
    val small: MediaSize,
    val large: MediaSize,
    val translations: List<MediaTranslation>
) {
    companion object {
        fun create(
            idGenerator: IdGenerator<EntityId>,
            uploadedBy: UserId,
            thumbnail: MediaSize,
            small: MediaSize,
            large: MediaSize,
            translations: List<MediaTranslation>
        ): Media {
            return Media(
                id = MediaId(idGenerator.generate().value),
                uploadedBy = uploadedBy,
                thumbnail = thumbnail,
                small = small,
                large = large,
                translations = translations,
            )
        }

        fun createWithId(
            id: MediaId,
            uploadedBy: UserId,
            thumbnail: MediaSize,
            small: MediaSize,
            large: MediaSize,
            translations: List<MediaTranslation>
        ): Media {
            return Media(
                id = id,
                uploadedBy = uploadedBy,
                thumbnail = thumbnail,
                small = small,
                large = large,
                translations = translations,
            )
        }
    }
}
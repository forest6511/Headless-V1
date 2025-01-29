package com.headblog.backend.domain.model.media

import com.headblog.backend.domain.model.user.UserId
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator

class Media private constructor(
    val id: MediaId,
    val uploadedBy: UserId,
    val thumbnail: MediaSize,
    val medium: MediaSize,
    val translations: List<Translation>
) {
    companion object {
        fun create(
            idGenerator: IdGenerator<EntityId>,
            uploadedBy: UserId,
            thumbnail: MediaSize,
            medium: MediaSize,
            translations: List<Translation>
        ): Media {
            return Media(
                id = MediaId(idGenerator.generate().value),
                uploadedBy = uploadedBy,
                thumbnail = thumbnail,
                medium = medium,
                translations = translations,
            )
        }

        fun createWithId(
            id: MediaId,
            uploadedBy: UserId,
            thumbnail: MediaSize,
            medium: MediaSize,
            translations: List<Translation>
        ): Media {
            return Media(
                id = id,
                uploadedBy = uploadedBy,
                thumbnail = thumbnail,
                medium = medium,
                translations = translations,
            )
        }
    }
}
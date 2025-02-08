package com.headblog.backend.infra.repository.media

import com.headblog.backend.app.usecase.media.query.MediaTranslationDto
import com.headblog.backend.app.usecase.post.FeaturedImageDto
import com.headblog.infra.jooq.tables.references.MEDIAS
import com.headblog.infra.jooq.tables.references.MEDIA_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.POSTS
import org.jooq.Record

object MediaQueryHelper {
    fun createFeaturedImageDto(record: Record): FeaturedImageDto? {
        val featuredImageId = record.get(POSTS.FEATURED_IMAGE_ID)
        return if (featuredImageId != null && record.get(MEDIAS.ID) != null) {
            FeaturedImageDto(
                id = featuredImageId,
                thumbnailUrl = requireNotNull(record.get(MEDIAS.THUMBNAIL_URL)),
                smallUrl = requireNotNull(record.get(MEDIAS.SMALL_URL)),
                largeUrl = requireNotNull(record.get(MEDIAS.LARGE_URL)),
                translations = listOf(
                    MediaTranslationDto(
                        language = requireNotNull(record.get(MEDIA_TRANSLATIONS.LANGUAGE)),
                        title = requireNotNull(record.get(MEDIA_TRANSLATIONS.TITLE))
                    )
                )
            )
        } else null
    }
}
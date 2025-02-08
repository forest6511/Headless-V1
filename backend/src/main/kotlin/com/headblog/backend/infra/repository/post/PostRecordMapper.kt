package com.headblog.backend.infra.repository.post

import com.headblog.backend.app.usecase.media.query.MediaTranslationDto
import com.headblog.backend.app.usecase.post.FeaturedImageDto
import com.headblog.backend.app.usecase.post.PostDto
import com.headblog.backend.app.usecase.post.PostTranslationDto
import com.headblog.infra.jooq.tables.references.MEDIAS
import com.headblog.infra.jooq.tables.references.MEDIA_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.POSTS
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
import com.headblog.infra.jooq.tables.references.POST_TRANSLATIONS
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record

object PostRecordMapper {

    fun Record.toPostDto(dsl: DSLContext): PostDto {
        val postId = requireNotNull(get(POSTS.ID))
        val featuredImageId = get(POSTS.FEATURED_IMAGE_ID)

        return PostDto(
            id = postId,
            slug = requireNotNull(get(POSTS.SLUG)),
            featuredImageId = featuredImageId,
            featuredImage = toFeaturedImageDto(featuredImageId),
            categoryId = requireNotNull(get(POST_CATEGORIES.CATEGORY_ID)),
            tags = TagQueryHelper.fetchTagsForPost(dsl, postId),
            translations = listOf(toTranslationDto()),
            createdAt = requireNotNull(get(POSTS.CREATED_AT)),
            updatedAt = requireNotNull(get(POSTS.UPDATED_AT))
        )
    }

    private fun Record.toFeaturedImageDto(featuredImageId: UUID?): FeaturedImageDto? {
        return if (featuredImageId != null && get(MEDIAS.ID) != null) {
            FeaturedImageDto(
                id = featuredImageId,
                thumbnailUrl = requireNotNull(get(MEDIAS.THUMBNAIL_URL)),
                smallUrl = requireNotNull(get(MEDIAS.SMALL_URL)),
                largeUrl = requireNotNull(get(MEDIAS.LARGE_URL)),
                translations = listOf(toMediaTranslationDto())
            )
        } else null
    }

    private fun Record.toMediaTranslationDto(): MediaTranslationDto {
        return MediaTranslationDto(
            language = requireNotNull(get(MEDIA_TRANSLATIONS.LANGUAGE)),
            title = requireNotNull(get(MEDIA_TRANSLATIONS.TITLE))
        )
    }

    private fun Record.toTranslationDto(): PostTranslationDto {
        return PostTranslationDto(
            language = requireNotNull(get(POST_TRANSLATIONS.LANGUAGE)),
            status = requireNotNull(get(POST_TRANSLATIONS.STATUS)),
            title = requireNotNull(get(POST_TRANSLATIONS.TITLE)),
            excerpt = requireNotNull(get(POST_TRANSLATIONS.EXCERPT)),
            content = requireNotNull(get(POST_TRANSLATIONS.CONTENT))
        )
    }
}
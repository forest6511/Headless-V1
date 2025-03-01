package com.headblog.backend.infra.repository.post.client

import com.headblog.backend.app.usecase.post.PostDto
import com.headblog.backend.domain.model.post.Status
import com.headblog.backend.domain.model.post.client.PostClientRepository
import com.headblog.backend.infra.repository.media.MediaQueryHelper
import com.headblog.backend.infra.repository.post.PostRecordMapper
import com.headblog.backend.infra.repository.post.TagQueryHelper
import com.headblog.infra.jooq.tables.references.MEDIAS
import com.headblog.infra.jooq.tables.references.MEDIA_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.POSTS
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
import com.headblog.infra.jooq.tables.references.POST_TRANSLATIONS
import java.util.*
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class PostClientRepositoryImpl(
    private val dsl: DSLContext
) : PostClientRepository {

    override fun findPublishedPosts(
        language: String, cursorPostId: UUID?, pageSize: Int
    ): List<PostDto> {
        val query = dsl.select(
            POSTS.asterisk(),
            POST_CATEGORIES.CATEGORY_ID,
            POST_TRANSLATIONS.LANGUAGE,
            POST_TRANSLATIONS.STATUS,
            POST_TRANSLATIONS.TITLE,
            POST_TRANSLATIONS.EXCERPT,
            MEDIAS.asterisk(),
            MEDIA_TRANSLATIONS.LANGUAGE,
            MEDIA_TRANSLATIONS.TITLE
        ).from(POSTS).innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID)).innerJoin(POST_TRANSLATIONS)
            .on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID)).leftJoin(MEDIAS).on(POSTS.FEATURED_IMAGE_ID.eq(MEDIAS.ID))
            .leftJoin(MEDIA_TRANSLATIONS).on(MEDIAS.ID.eq(MEDIA_TRANSLATIONS.MEDIA_ID))
            .and(MEDIA_TRANSLATIONS.LANGUAGE.eq(language)).where(POST_TRANSLATIONS.LANGUAGE.eq(language))
            .and(POST_TRANSLATIONS.STATUS.eq(Status.PUBLISHED.name))

        // カーソル条件
        cursorPostId?.let { id ->
            query.and(POSTS.ID.lessThan(id))
        }

        val records = query.orderBy(POSTS.ID.desc()).limit(pageSize + 1).fetch()

        return records.map { record ->
            PostDto(
                id = requireNotNull(record.get(POSTS.ID)),
                slug = requireNotNull(record.get(POSTS.SLUG)),
                featuredImageId = record.get(POSTS.FEATURED_IMAGE_ID),
                featuredImage = MediaQueryHelper.createFeaturedImageDto(record),
                categoryId = requireNotNull(record.get(POST_CATEGORIES.CATEGORY_ID)),
                tags = TagQueryHelper.fetchTagsForPost(dsl, checkNotNull(record.get(POSTS.ID))),
                translations = listOf(
                    com.headblog.backend.app.usecase.post.PostTranslationDto(
                        language = language,
                        status = requireNotNull(record.get(POST_TRANSLATIONS.STATUS)),
                        title = requireNotNull(record.get(POST_TRANSLATIONS.TITLE)),
                        excerpt = requireNotNull(record.get(POST_TRANSLATIONS.EXCERPT)),
                        content = "" // contentは不要なので空文字を設定
                    )
                ),
                createdAt = requireNotNull(record.get(POSTS.CREATED_AT)),
                updatedAt = requireNotNull(record.get(POSTS.UPDATED_AT))
            )
        }
    }

    override fun findPublishedPostBySlug(
        language: String, slug: String
    ): PostDto? {
        val query = dsl.select(
            POSTS.asterisk(),
            POST_CATEGORIES.CATEGORY_ID,
            POST_TRANSLATIONS.LANGUAGE,
            POST_TRANSLATIONS.STATUS,
            POST_TRANSLATIONS.TITLE,
            POST_TRANSLATIONS.CONTENT,
            POST_TRANSLATIONS.EXCERPT,
            MEDIAS.asterisk(),
            MEDIA_TRANSLATIONS.LANGUAGE,
            MEDIA_TRANSLATIONS.TITLE
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .innerJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))
            .leftJoin(MEDIAS).on(POSTS.FEATURED_IMAGE_ID.eq(MEDIAS.ID))
            .leftJoin(MEDIA_TRANSLATIONS).on(MEDIAS.ID.eq(MEDIA_TRANSLATIONS.MEDIA_ID))
            .and(MEDIA_TRANSLATIONS.LANGUAGE.eq(language))
            .where(POSTS.SLUG.eq(slug))
            .and(POST_TRANSLATIONS.LANGUAGE.eq(language))
            .and(POST_TRANSLATIONS.STATUS.eq(Status.PUBLISHED.name))

        return query.fetchOne()?.let { record ->
            PostRecordMapper.run { record.toPostDto(dsl) }
        }
    }
}
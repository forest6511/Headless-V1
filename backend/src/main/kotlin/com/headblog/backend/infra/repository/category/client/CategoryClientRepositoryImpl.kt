package com.headblog.backend.infra.repository.category.client

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryTranslationDto
import com.headblog.backend.app.usecase.post.PostDto
import com.headblog.backend.app.usecase.post.PostTranslationDto
import com.headblog.backend.app.usecase.tag.query.TagDto
import com.headblog.backend.domain.model.category.client.CategoryClientRepository
import com.headblog.backend.domain.model.post.Status
import com.headblog.backend.infra.repository.media.MediaQueryHelper
import com.headblog.backend.infra.repository.post.TagQueryHelper
import com.headblog.infra.jooq.tables.references.CATEGORIES
import com.headblog.infra.jooq.tables.references.CATEGORY_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.MEDIAS
import com.headblog.infra.jooq.tables.references.MEDIA_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.POSTS
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
import com.headblog.infra.jooq.tables.references.POST_TRANSLATIONS
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class CategoryClientRepositoryImpl(
    private val dsl: DSLContext
) : CategoryClientRepository {

    override fun findPublishedPostsByCategorySlug(
        slug: String,
        language: String,
        pageSize: Int
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
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .innerJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))
            .innerJoin(CATEGORIES).on(POST_CATEGORIES.CATEGORY_ID.eq(CATEGORIES.ID))
            .leftJoin(MEDIAS).on(POSTS.FEATURED_IMAGE_ID.eq(MEDIAS.ID))
            .leftJoin(MEDIA_TRANSLATIONS).on(MEDIAS.ID.eq(MEDIA_TRANSLATIONS.MEDIA_ID))
            .where(CATEGORIES.SLUG.eq(slug))
            .and(POST_TRANSLATIONS.LANGUAGE.eq(language))
            .and(POST_TRANSLATIONS.STATUS.eq(Status.PUBLISHED.name))
            .orderBy(POSTS.CREATED_AT.desc())
            .limit(pageSize)

        return query.fetch().map { record ->
            PostDto(
                id = requireNotNull(record.get(POSTS.ID)),
                slug = requireNotNull(record.get(POSTS.SLUG)),
                featuredImageId = record.get(POSTS.FEATURED_IMAGE_ID),
                featuredImage = MediaQueryHelper.createFeaturedImageDto(record),
                categoryId = requireNotNull(record.get(POST_CATEGORIES.CATEGORY_ID)),
                tags = fetchTagsForPost(record.get(POSTS.ID)!!),
                translations = listOf(
                    PostTranslationDto(
                        language = language,
                        status = requireNotNull(record.get(POST_TRANSLATIONS.STATUS)),
                        title = requireNotNull(record.get(POST_TRANSLATIONS.TITLE)),
                        excerpt = requireNotNull(record.get(POST_TRANSLATIONS.EXCERPT)),
                        content = "" // 記事一覧なのでcontentは不要
                    )
                ),
                createdAt = requireNotNull(record.get(POSTS.CREATED_AT)),
                updatedAt = requireNotNull(record.get(POSTS.UPDATED_AT))
            )
        }
    }

    override fun findPublishedPostsByParentCategorySlug(
        parentSlug: String,
        language: String,
        pageSize: Int
    ): List<PostDto> {
        // 親カテゴリとその子カテゴリのIDを取得するサブクエリ
        val categoryIds = dsl.select(CATEGORIES.ID)
            .from(CATEGORIES)
            .where(CATEGORIES.SLUG.eq(parentSlug))
            // 親カテゴリを親に持つ子カテゴリを取得
            .unionAll(
                dsl.select(CATEGORIES.ID)
                    .from(CATEGORIES)
                    .where(
                        CATEGORIES.PARENT_ID.eq(
                            dsl.select(CATEGORIES.ID)
                                .from(CATEGORIES)
                                .where(CATEGORIES.SLUG.eq(parentSlug))
                        )
                    )
            )

        // 記事を取得するメインクエリ
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
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .innerJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))
            .leftJoin(MEDIAS).on(POSTS.FEATURED_IMAGE_ID.eq(MEDIAS.ID))
            .leftJoin(MEDIA_TRANSLATIONS).on(MEDIAS.ID.eq(MEDIA_TRANSLATIONS.MEDIA_ID))
            .and(MEDIA_TRANSLATIONS.LANGUAGE.eq(language))
            .where(POST_CATEGORIES.CATEGORY_ID.`in`(categoryIds))
            .and(POST_TRANSLATIONS.LANGUAGE.eq(language))
            .and(POST_TRANSLATIONS.STATUS.eq(Status.PUBLISHED.name))
            .orderBy(POSTS.CREATED_AT.desc())
            .limit(pageSize)

        return query.fetch().map { record ->
            PostDto(
                id = requireNotNull(record.get(POSTS.ID)),
                slug = requireNotNull(record.get(POSTS.SLUG)),
                featuredImageId = record.get(POSTS.FEATURED_IMAGE_ID),
                featuredImage = MediaQueryHelper.createFeaturedImageDto(record),
                categoryId = requireNotNull(record.get(POST_CATEGORIES.CATEGORY_ID)),
                tags = fetchTagsForPost(requireNotNull(record.get(POSTS.ID))),
                translations = listOf(
                    PostTranslationDto(
                        language = language,
                        status = requireNotNull(record.get(POST_TRANSLATIONS.STATUS)),
                        title = requireNotNull(record.get(POST_TRANSLATIONS.TITLE)),
                        excerpt = requireNotNull(record.get(POST_TRANSLATIONS.EXCERPT)),
                        content = "" // 記事一覧なのでcontentは不要
                    )
                ),
                createdAt = requireNotNull(record.get(POSTS.CREATED_AT)),
                updatedAt = requireNotNull(record.get(POSTS.UPDATED_AT))
            )
        }
    }

    override fun findCategoryByPath(slugs: List<String>, language: String): CategoryDto? {
        // 最後のスラッグ（対象のカテゴリ）を取得
        val lastSlug = slugs.last()

        // 単一カテゴリの場合（スラッグが1つ）
        return if (slugs.size == 1) {
            findSingleCategory(lastSlug, language)
        } else {
            findHierarchicalCategory(slugs, lastSlug, language)
        }
    }

    // 単一カテゴリを検索するプライベートメソッド
    private fun findSingleCategory(slug: String, language: String): CategoryDto? {
        return dsl.select()
            .from(CATEGORIES)
            .innerJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .where(CATEGORIES.SLUG.eq(slug))
            .and(CATEGORY_TRANSLATIONS.LANGUAGE.eq(language))
            .fetchOne()
            ?.toCategoryDto(language)
    }

    // 階層的カテゴリを検索するプライベートメソッド
    private fun findHierarchicalCategory(slugs: List<String>, lastSlug: String, language: String): CategoryDto? {
        return dsl.select()
            .from(CATEGORIES)
            .innerJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .where(CATEGORIES.SLUG.eq(lastSlug))
            .and(CATEGORY_TRANSLATIONS.LANGUAGE.eq(language))
            .and(
                CATEGORIES.PARENT_ID.eq(
                    dsl.select(CATEGORIES.ID)
                        .from(CATEGORIES)
                        .where(CATEGORIES.SLUG.eq(slugs[0]))
                )
            )
            .fetchOne()
            ?.toCategoryDto(language)
    }

    // レコードをCategoryDtoに変換する拡張関数
    private fun Record.toCategoryDto(language: String): CategoryDto {
        return CategoryDto(
            id = requireNotNull(this[CATEGORIES.ID]),
            slug = requireNotNull(this[CATEGORIES.SLUG]),
            parentId = this[CATEGORIES.PARENT_ID],
            translations = listOf(
                CategoryTranslationDto(
                    language = language,
                    name = requireNotNull(this[CATEGORY_TRANSLATIONS.NAME]),
                    description = this[CATEGORY_TRANSLATIONS.DESCRIPTION],
                    createdAt = requireNotNull(this[CATEGORY_TRANSLATIONS.CREATED_AT]),
                    updatedAt = requireNotNull(this[CATEGORY_TRANSLATIONS.UPDATED_AT])
                )
            ),
            createdAt = requireNotNull(this[CATEGORIES.CREATED_AT]),
            updatedAt = requireNotNull(this[CATEGORIES.UPDATED_AT])
        )
    }

    private fun fetchTagsForPost(postId: UUID): List<TagDto> {
        return TagQueryHelper.fetchTagsForPost(dsl, postId)
    }
}
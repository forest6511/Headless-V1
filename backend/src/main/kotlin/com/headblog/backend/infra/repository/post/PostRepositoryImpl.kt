package com.headblog.backend.infra.repository.post

import com.headblog.backend.app.usecase.post.query.PostDto
import com.headblog.backend.app.usecase.post.query.TranslationDto
import com.headblog.backend.app.usecase.tag.query.TagDto
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.infra.jooq.tables.references.POSTS
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
import com.headblog.infra.jooq.tables.references.POST_TAGS
import com.headblog.infra.jooq.tables.references.POST_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.TAGS
import java.time.LocalDateTime
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class PostRepositoryImpl(
    private val dsl: DSLContext
) : PostRepository {

    override fun save(post: Post): Int {
        // INSERT posts
        val insertedRows = dsl.insertInto(POSTS)
            .set(POSTS.ID, post.id.value)
            .set(POSTS.SLUG, post.slug.value)
            .set(POSTS.STATUS, post.status.name)
            .set(POSTS.FEATURED_IMAGE_ID, post.featuredImageId)
            .execute()

        // INSERT post_translations
        post.translations.forEach { translation ->
            dsl.insertInto(POST_TRANSLATIONS)
                .set(POST_TRANSLATIONS.POST_ID, post.id.value)
                .set(POST_TRANSLATIONS.LANGUAGE, translation.language.value)
                .set(POST_TRANSLATIONS.TITLE, translation.title)
                .set(POST_TRANSLATIONS.EXCERPT, translation.excerpt)
                .set(POST_TRANSLATIONS.CONTENT, translation.content)
                .execute()
        }

        return insertedRows
    }

    override fun update(post: Post): Int {
        // UPDATE posts
        val updatedRows = dsl.update(POSTS)
            .set(POSTS.SLUG, post.slug.value)
            .set(POSTS.STATUS, post.status.name)
            .set(POSTS.FEATURED_IMAGE_ID, post.featuredImageId)
            .set(POSTS.UPDATED_AT, LocalDateTime.now())
            .where(POSTS.ID.eq(post.id.value))
            .execute()

        post.translations.forEach { translation ->
            dsl.insertInto(POST_TRANSLATIONS)
                .set(POST_TRANSLATIONS.POST_ID, post.id.value)
                .set(POST_TRANSLATIONS.LANGUAGE, translation.language.value)
                .set(POST_TRANSLATIONS.TITLE, translation.title)
                .set(POST_TRANSLATIONS.EXCERPT, translation.excerpt)
                .set(POST_TRANSLATIONS.CONTENT, translation.content)
                .onConflict(POST_TRANSLATIONS.POST_ID, POST_TRANSLATIONS.LANGUAGE)
                .doUpdate()
                .set(POST_TRANSLATIONS.TITLE, translation.title)
                .set(POST_TRANSLATIONS.EXCERPT, translation.excerpt)
                .set(POST_TRANSLATIONS.CONTENT, translation.content)
                .set(POST_TRANSLATIONS.UPDATED_AT, LocalDateTime.now())
                .execute()
        }

        return updatedRows
    }

    override fun delete(post: Post): Int {
        return dsl.deleteFrom(POSTS)
            .where(POSTS.ID.eq(post.id.value))
            .execute()
    }

    override fun findById(id: UUID): PostDto? {
        val records = dsl.select(
            POSTS.asterisk(),
            POST_CATEGORIES.CATEGORY_ID,
            POST_TRANSLATIONS.LANGUAGE,
            POST_TRANSLATIONS.TITLE,
            POST_TRANSLATIONS.EXCERPT,
            POST_TRANSLATIONS.CONTENT
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .leftJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))
            .where(POSTS.ID.eq(id))
            .fetch()

        if (records.isEmpty()) return null

        return records.groupBy(
            keySelector = { it.get(POSTS.ID)!! },
            valueTransform = { it }
        ).values.firstOrNull()?.toPostWithTranslationsDto()
    }

    override fun findBySlug(slug: String): PostDto? {
        val records = dsl.select(
            POSTS.asterisk(),
            POST_CATEGORIES.CATEGORY_ID,
            POST_TRANSLATIONS.LANGUAGE,
            POST_TRANSLATIONS.TITLE,
            POST_TRANSLATIONS.EXCERPT,
            POST_TRANSLATIONS.CONTENT
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .leftJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))
            .where(POSTS.SLUG.eq(slug))
            .fetch()

        if (records.isEmpty()) return null

        return records.groupBy(
            { it.get(POSTS.ID)!! },
            { it }
        ).values.firstOrNull()?.toPostWithTranslationsDto()
    }

    override fun findAll(
        cursorPostId: UUID?,
        pageSize: Int
    ): List<PostDto> {
        // 1) ベースクエリ
        val query = dsl.select(
            POSTS.asterisk(),
            POST_CATEGORIES.CATEGORY_ID,
            POST_TRANSLATIONS.LANGUAGE,
            POST_TRANSLATIONS.TITLE,
            POST_TRANSLATIONS.EXCERPT,
            POST_TRANSLATIONS.CONTENT
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .leftJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))

        // カーソル条件がある場合 (2ページ目以降)
        cursorPostId?.let { id ->
            query.where(POSTS.ID.lessThan(id)) // UUID の大小比較
        }

        val records = query
            .orderBy(POSTS.ID.desc())
            .limit(pageSize + 1)
            .fetch()

        // 2) 同じ post_id の行をまとめる
        val grouped = records.groupBy(
            // group by postId
            keySelector = { requireNotNull(it.get(POSTS.ID)) },
            valueTransform = { it }
        )

        // 3) group した結果を PostDto に変換
        return grouped.values.map { recordList ->
            recordList.toPostWithTranslationsDto()
        }
    }

    override fun count(): Int = dsl.fetchCount(POSTS)


    private fun fetchTagsForPost(postId: UUID): List<TagDto> {
        return dsl.select(TAGS.ID, TAGS.NAME, TAGS.SLUG)
            .from(TAGS)
            .join(POST_TAGS).on(TAGS.ID.eq(POST_TAGS.TAG_ID))
            .where(POST_TAGS.POST_ID.eq(postId))
            .fetch()
            .map { it.toTagDto() }
    }

    /**
     * Record のリストをまとめて PostDto に変換
     *
     * - 同じ postId の行をまとめた結果 (翻訳が複数行)
     * - categoryId はレコードが同じなので最初の行から取得
     * - tags は fetchTagsForPost() で別途取得
     */
    private fun List<Record>.toPostWithTranslationsDto(): PostDto {
        val first = this.first()
        val postId = requireNotNull(first.get(POSTS.ID))

        val slug = requireNotNull(first.get(POSTS.SLUG))
        val status = requireNotNull(first.get(POSTS.STATUS))
        val featuredImageId = first.get(POSTS.FEATURED_IMAGE_ID)
        val categoryId = requireNotNull(first.get(POST_CATEGORIES.CATEGORY_ID))
        val createdAt = requireNotNull(first.get(POSTS.CREATED_AT))
        val updatedAt = requireNotNull(first.get(POSTS.UPDATED_AT))

        // 全レコードを翻訳ごとにまとめる
        val translationList = this.map { rec ->
            val lang = requireNotNull(rec.get(POST_TRANSLATIONS.LANGUAGE))
            TranslationDto(
                language = lang,
                title = requireNotNull(rec.get(POST_TRANSLATIONS.TITLE)),
                excerpt = requireNotNull(rec.get(POST_TRANSLATIONS.EXCERPT)),
                content = requireNotNull(rec.get(POST_TRANSLATIONS.CONTENT)),
            )
        }

        // タグ取得
        val tags = fetchTagsForPost(postId)

        return PostDto(
            id = postId,
            slug = slug,
            status = status,
            featuredImageId = featuredImageId,
            categoryId = categoryId,
            tags = tags,
            translations = translationList,
            createdAt = createdAt,
            updatedAt = updatedAt,
        )
    }

    private fun Record.toTagDto(): TagDto {
        return TagDto(
            id = requireNotNull(get(TAGS.ID)),
            name = requireNotNull(get(TAGS.NAME)),
            slug = requireNotNull(get(TAGS.SLUG)),
        )
    }
}

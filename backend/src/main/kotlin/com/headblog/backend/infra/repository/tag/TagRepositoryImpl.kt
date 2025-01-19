package com.headblog.backend.infra.repository.tag

import com.headblog.backend.app.usecase.post.query.PostDto
import com.headblog.backend.app.usecase.post.query.TranslationDto
import com.headblog.backend.app.usecase.tag.query.TagDto
import com.headblog.backend.domain.model.post.Status
import com.headblog.backend.domain.model.tag.Tag
import com.headblog.backend.domain.model.tag.TagId
import com.headblog.backend.domain.model.tag.TagRepository
import com.headblog.infra.jooq.tables.references.POSTS
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
import com.headblog.infra.jooq.tables.references.POST_TAGS
import com.headblog.infra.jooq.tables.references.POST_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.TAGS
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class TagRepositoryImpl(
    private val dsl: DSLContext
) : TagRepository {

    override fun save(tag: Tag): Int {
        return dsl.insertInto(TAGS)
            .set(TAGS.ID, tag.id.value)
            .set(TAGS.NAME, tag.name)
            .set(TAGS.SLUG, tag.slug)
            .execute()
    }

    override fun update(tag: Tag): Int {
        return dsl.update(TAGS)
            .set(TAGS.NAME, tag.name)
            .set(TAGS.SLUG, tag.slug)
            .where(TAGS.ID.eq(tag.id.value))
            .execute()
    }

    override fun delete(tagId: TagId): Int {
        return dsl.deleteFrom(TAGS)
            .where(TAGS.ID.eq(tagId.value))
            .execute()
    }

    override fun findById(id: UUID): TagDto? {
        return dsl.select()
            .from(TAGS)
            .where(TAGS.ID.eq(id))
            .fetchOne()
            ?.toTagDto()
    }

    override fun findByName(name: String): TagDto? {
        return dsl.select()
            .from(TAGS)
            .where(TAGS.NAME.eq(name))
            .fetchOne()
            ?.toTagDto()
    }

    override fun findPublishedPostsByTagName(
        name: String,
        language: String,
        pageSize: Int
    ): List<PostDto> {
        val query = dsl.select(
            POSTS.asterisk(),
            POST_TAGS.TAG_ID,
            POST_CATEGORIES.CATEGORY_ID,
            POST_TRANSLATIONS.LANGUAGE,
            POST_TRANSLATIONS.STATUS,
            POST_TRANSLATIONS.TITLE,
            POST_TRANSLATIONS.EXCERPT
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .innerJoin(POST_TAGS).on(POSTS.ID.eq(POST_TAGS.POST_ID))
            // TAGSテーブルとの結合を追加
            .innerJoin(TAGS).on(POST_TAGS.TAG_ID.eq(TAGS.ID))
            .innerJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))
            // タグ名で検索
            .where(TAGS.NAME.eq(name))
            .and(POST_TRANSLATIONS.LANGUAGE.eq(language))
            .and(POST_TRANSLATIONS.STATUS.eq(Status.PUBLISHED.name))
            .orderBy(POSTS.CREATED_AT.desc())
            .limit(pageSize)

        return query.fetch().map { record ->
            PostDto(
                id = requireNotNull(record.get(POSTS.ID)),
                slug = requireNotNull(record.get(POSTS.SLUG)),
                featuredImageId = record.get(POSTS.FEATURED_IMAGE_ID),
                categoryId = requireNotNull(record.get(POST_CATEGORIES.CATEGORY_ID)),
                tags = fetchTagsForPost(requireNotNull(record.get(POSTS.ID))),
                translations = listOf(
                    TranslationDto(
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

    private fun fetchTagsForPost(postId: UUID): List<TagDto> {
        return dsl.select(TAGS.ID, TAGS.NAME, TAGS.SLUG)
            .from(TAGS)
            .join(POST_TAGS).on(TAGS.ID.eq(POST_TAGS.TAG_ID))
            .where(POST_TAGS.POST_ID.eq(postId))
            .fetch()
            .map { it.toTagDto() }
    }

    private fun Record.toTagDto(): TagDto {
        return TagDto(
            id = checkNotNull(get(TAGS.ID)),
            name = checkNotNull(get(TAGS.NAME)),
            slug = checkNotNull(get(TAGS.SLUG)),
        )
    }
}

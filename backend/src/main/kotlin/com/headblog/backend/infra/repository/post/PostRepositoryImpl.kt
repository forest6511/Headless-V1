package com.headblog.backend.infra.repository.post

import com.headblog.backend.app.usecase.post.query.PostDto
import com.headblog.backend.app.usecase.post.query.PostWithCategoryIdDto
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.infra.jooq.tables.references.POSTS
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
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
        return dsl.insertInto(POSTS)
            .set(POSTS.ID, post.id.value)
            .set(POSTS.TITLE, post.title)
            .set(POSTS.SLUG, post.slug.value)
            .set(POSTS.CONTENT, post.content)
            .set(POSTS.EXCERPT, post.excerpt)
            .set(POSTS.STATUS, post.postStatus.name)
            .set(POSTS.FEATURED_IMAGE_ID, post.featuredImageId)
            .set(POSTS.META_TITLE, post.metaTitle)
            .set(POSTS.META_DESCRIPTION, post.metaDescription)
            .set(POSTS.META_KEYWORDS, post.metaKeywords)
            .set(POSTS.OG_TITLE, post.ogTitle)
            .set(POSTS.OG_DESCRIPTION, post.ogDescription)
            .execute()
    }

    override fun update(post: Post): Int {
        return dsl.update(POSTS)
            .set(POSTS.TITLE, post.title)
            .set(POSTS.SLUG, post.slug.value)
            .set(POSTS.CONTENT, post.content)
            .set(POSTS.EXCERPT, post.excerpt)
            .set(POSTS.STATUS, post.postStatus.name)
            .set(POSTS.FEATURED_IMAGE_ID, post.featuredImageId)
            .set(POSTS.META_TITLE, post.metaTitle)
            .set(POSTS.META_DESCRIPTION, post.metaDescription)
            .set(POSTS.META_KEYWORDS, post.metaKeywords)
            .set(POSTS.OG_TITLE, post.ogTitle)
            .set(POSTS.OG_DESCRIPTION, post.ogDescription)
            .set(POSTS.UPDATED_AT, LocalDateTime.now())
            .where(POSTS.ID.eq(post.id.value))
            .execute()
    }

    override fun delete(post: Post): Int {
        return dsl.deleteFrom(POSTS)
            .where(POSTS.ID.eq(post.id.value))
            .execute()
    }

    override fun findById(id: UUID): PostDto? =
        dsl.select()
            .from(POSTS)
            .innerJoin(POST_CATEGORIES)
            .on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .where(POSTS.ID.eq(id))
            .fetchOne()
            ?.toPostDto()

    override fun findBySlug(slug: String): PostDto? =
        dsl.select()
            .from(POSTS)
            .innerJoin(POST_CATEGORIES)
            .on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .where(POSTS.SLUG.eq(slug))
            .fetchOne()
            ?.toPostDto()

    override fun findAll(
        cursorPostId: UUID?,
        pageSize: Int,
    ): List<PostWithCategoryIdDto> {
        val query = createBaseQuery()

        // カーソル条件がある場合 (2ページ目以降)
        cursorPostId?.let { id ->
            // Postgres UUID V7
            query.where(POSTS.ID.lessThan(id))
        }

        return query
            // Postgres UUID V7
            .orderBy(POSTS.ID.desc())
            .limit(pageSize + 1)
            .fetch()
            .map { it.toPostWithCategoryIdDto() }
    }

    override fun count(): Int = dsl.fetchCount(POSTS)

    private fun createBaseQuery() =
        dsl.select(
            POSTS.asterisk(),
            POST_CATEGORIES.CATEGORY_ID
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES)
            .on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))

    // toDto
    private fun Record.toPostDto(): PostDto {
        return PostDto(
            id = get(POSTS.ID)!!,
            title = get(POSTS.TITLE)!!,
            slug = get(POSTS.SLUG)!!,
            content = get(POSTS.CONTENT)!!,
            excerpt = get(POSTS.EXCERPT)!!,
            postStatus = get(POSTS.STATUS)!!,
            featuredImageId = get(POSTS.FEATURED_IMAGE_ID),
            metaTitle = get(POSTS.META_TITLE),
            metaDescription = get(POSTS.META_DESCRIPTION),
            metaKeywords = get(POSTS.META_KEYWORDS),
            ogTitle = get(POSTS.OG_TITLE),
            ogDescription = get(POSTS.OG_DESCRIPTION),
            categoryId = get(POST_CATEGORIES.CATEGORY_ID)!!
        )
    }

    private fun Record.toPostWithCategoryIdDto(): PostWithCategoryIdDto {
        return PostWithCategoryIdDto(
            id = get(POSTS.ID)!!,
            title = get(POSTS.TITLE)!!,
            slug = get(POSTS.SLUG)!!,
            content = get(POSTS.CONTENT)!!,
            excerpt = get(POSTS.EXCERPT)!!,
            postStatus = get(POSTS.STATUS)!!,
            featuredImageId = get(POSTS.FEATURED_IMAGE_ID),
            metaTitle = get(POSTS.META_TITLE),
            metaDescription = get(POSTS.META_DESCRIPTION),
            metaKeywords = get(POSTS.META_KEYWORDS),
            ogTitle = get(POSTS.OG_TITLE),
            ogDescription = get(POSTS.OG_DESCRIPTION),
            updateAt = get(POSTS.UPDATED_AT)!!,
            categoryId = get(POST_CATEGORIES.CATEGORY_ID)!!,
        )
    }
}
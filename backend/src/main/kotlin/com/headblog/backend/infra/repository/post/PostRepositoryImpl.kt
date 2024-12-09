package com.headblog.backend.infra.repository.post

import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.infra.jooq.tables.references.POSTS
import org.jooq.DSLContext
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
            .set(POSTS.ROBOTS_META_TAG, post.robotsMetaTag)
            .set(POSTS.OG_TITLE, post.ogTitle)
            .set(POSTS.OG_DESCRIPTION, post.ogDescription)
            .execute()
    }

}
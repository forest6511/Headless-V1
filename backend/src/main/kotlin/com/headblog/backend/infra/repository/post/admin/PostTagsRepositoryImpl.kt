package com.headblog.backend.infra.repository.post.admin

import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.admin.PostTagsRepository
import com.headblog.backend.domain.model.tag.TagId
import com.headblog.infra.jooq.tables.references.POST_TAGS
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class PostTagsRepositoryImpl(
    private val dsl: DSLContext
) : PostTagsRepository {

    override fun addTagToPost(postId: PostId, tagId: TagId): Int {
        return dsl.insertInto(POST_TAGS)
            .set(POST_TAGS.POST_ID, postId.value)
            .set(POST_TAGS.TAG_ID, tagId.value)
            .execute()
    }

    override fun removeTagFromPost(postId: PostId, tagId: TagId): Int {
        return dsl.deleteFrom(POST_TAGS)
            .where(POST_TAGS.POST_ID.eq(postId.value))
            .and(POST_TAGS.TAG_ID.eq(tagId.value))
            .execute()
    }

    override fun findTagsByPostId(postId: PostId): List<TagId> {
        return dsl.select(POST_TAGS.TAG_ID)
            .from(POST_TAGS)
            .where(POST_TAGS.POST_ID.eq(postId.value))
            .fetch()
            .map { TagId(it[POST_TAGS.TAG_ID]!!) }
    }

    override fun findPostsByTagId(tagId: TagId): List<PostId> {
        return dsl.select(POST_TAGS.POST_ID)
            .from(POST_TAGS)
            .where(POST_TAGS.TAG_ID.eq(tagId.value))
            .fetch()
            .map { PostId(it[POST_TAGS.POST_ID]!!) }
    }
}

package com.headblog.backend.infra.repository.post

import com.headblog.backend.app.usecase.tag.query.TagDto
import com.headblog.infra.jooq.tables.references.POST_TAGS
import com.headblog.infra.jooq.tables.references.TAGS
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record

object PostTagQueryHelper {
    fun fetchTagsForPost(dsl: DSLContext, postId: UUID): List<TagDto> {
        return dsl.select(TAGS.ID, TAGS.NAME, TAGS.SLUG)
            .from(TAGS)
            .join(POST_TAGS).on(TAGS.ID.eq(POST_TAGS.TAG_ID))
            .where(POST_TAGS.POST_ID.eq(postId))
            .fetch()
            .map { it.toTagDto() }
    }

    private fun Record.toTagDto(): TagDto {
        return TagDto(
            id = requireNotNull(get(TAGS.ID)),
            name = requireNotNull(get(TAGS.NAME)),
            slug = requireNotNull(get(TAGS.SLUG)),
        )
    }
}
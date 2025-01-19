package com.headblog.backend.domain.model.tag

import com.headblog.backend.app.usecase.post.query.PostDto
import com.headblog.backend.app.usecase.tag.query.TagDto
import java.util.*

interface TagRepository {
    fun save(tag: Tag): Int
    fun update(tag: Tag): Int
    fun delete(tagId: TagId): Int

    fun findById(id: UUID): TagDto?
    fun findByName(name: String): TagDto?

    fun findPublishedPostsByTagName(
        name: String,
        language: String,
        pageSize: Int
    ): List<PostDto>
}
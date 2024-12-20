package com.headblog.backend.domain.model.post

import com.headblog.backend.app.usecase.post.query.PostDto
import com.headblog.backend.app.usecase.post.query.PostWithCategoryIdDto
import java.util.*

interface PostRepository {
    fun save(post: Post): Int
    fun update(post: Post): Int
    fun delete(post: Post): Int
    fun findBySlug(slug: String): PostDto?
    fun findById(id: UUID): PostDto?

    fun findAll(
        cursorPostId: UUID?,
        pageSize: Int,
    ): List<PostWithCategoryIdDto>

    fun count(): Int
}
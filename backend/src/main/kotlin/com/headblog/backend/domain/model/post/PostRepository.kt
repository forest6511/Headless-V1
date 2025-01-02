package com.headblog.backend.domain.model.post

import com.headblog.backend.app.usecase.post.query.PostWithTranslationsDto
import java.util.*

interface PostRepository {

    fun save(post: Post): Int
    fun update(post: Post): Int
    fun delete(post: Post): Int

    fun findBySlug(slug: String): PostWithTranslationsDto?
    fun findById(id: UUID): PostWithTranslationsDto?

    fun findAll(
        cursorPostId: UUID?,
        pageSize: Int,
    ): List<PostWithTranslationsDto>

    fun count(): Int
}
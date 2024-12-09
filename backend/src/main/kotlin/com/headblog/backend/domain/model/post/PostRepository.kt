package com.headblog.backend.domain.model.post

import com.headblog.backend.app.usecase.post.query.PostDto

interface PostRepository {
    fun save(post: Post): Int
    fun update(post: Post): Int
    fun delete(post: Post): Int
    fun findBySlug(slug: String): PostDto?
}
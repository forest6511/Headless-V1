package com.headblog.backend.domain.model.post

interface PostRepository {
    fun save(post: Post): Int
}
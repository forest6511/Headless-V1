package com.headblog.backend.infra.api.client.post

import com.headblog.backend.app.usecase.post.query.GetPostQueryService
import com.headblog.backend.infra.api.client.post.response.PostClientResponse
import com.headblog.backend.infra.api.client.post.response.PostDetailClientResponse
import java.util.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/client/posts")
class PostClientController(
    private val getPostQueryService: GetPostQueryService
) {
    @GetMapping
    fun getPosts(
        @RequestParam language: String,
        @RequestParam(required = false) cursor: UUID?,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<List<PostClientResponse>> {
        val posts = getPostQueryService.findPublishedPosts(
            language = language,
            cursorPostId = cursor,
            pageSize = pageSize
        )
        return ResponseEntity.ok(posts)
    }

    @GetMapping("/{slug}")
    fun getPostBySlug(
        @PathVariable slug: String,
        @RequestParam language: String
    ): ResponseEntity<PostDetailClientResponse> {
        val post = getPostQueryService.findPublishedPostBySlug(
            slug = slug,
            language = language
        )
        return ResponseEntity.ok(post)
    }
}
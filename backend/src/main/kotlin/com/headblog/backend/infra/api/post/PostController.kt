package com.headblog.backend.infra.api.post

import com.headblog.backend.app.usecase.post.command.create.CreatePostCommand
import com.headblog.backend.app.usecase.post.command.create.CreatePostUseCase
import com.headblog.backend.infra.api.post.request.CreatePostRequest
import java.util.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/posts")
class PostController(
    private val createPostUseCase: CreatePostUseCase,
) {

    @PostMapping("/post")
    fun createPost(@RequestBody request: CreatePostRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val id = createPostUseCase.execute(command)
        return ResponseEntity.ok(id.value)
    }

    // toCommand メソッド
    private fun CreatePostRequest.toCommand(): CreatePostCommand {
        return CreatePostCommand(
            title = this.title,
            slug = this.slug,
            content = this.content,
            excerpt = this.excerpt,
            postStatus = this.postStatus,
            featuredImageId = this.featuredImageId,
            metaTitle = this.metaTitle,
            metaDescription = this.metaDescription,
            metaKeywords = this.metaKeywords,
            robotsMetaTag = this.robotsMetaTag,
            ogTitle = this.ogTitle,
            ogDescription = this.ogDescription,
            categoryId = this.categoryId,
        )
    }
}

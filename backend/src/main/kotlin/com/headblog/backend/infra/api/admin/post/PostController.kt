package com.headblog.backend.infra.api.admin.post

import com.headblog.backend.app.usecase.post.admin.create.CreatePostCommand
import com.headblog.backend.app.usecase.post.admin.create.CreatePostUseCase
import com.headblog.backend.app.usecase.post.admin.delete.DeletePostUseCase
import com.headblog.backend.app.usecase.post.admin.query.GetPostQueryService
import com.headblog.backend.app.usecase.post.admin.update.UpdatePostCommand
import com.headblog.backend.app.usecase.post.admin.update.UpdatePostUseCase
import com.headblog.backend.infra.api.admin.post.request.CreatePostRequest
import com.headblog.backend.infra.api.admin.post.request.UpdatePostRequest
import com.headblog.backend.infra.api.admin.post.response.PostListResponse
import com.headblog.backend.infra.api.admin.post.response.PostResponse
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/admin/posts")
class PostController(
    private val createPostUseCase: CreatePostUseCase,
    private val updatePostUseCase: UpdatePostUseCase,
    private val deletePostUseCase: DeletePostUseCase,
    private val getPostQueryService: GetPostQueryService
) {

    private val logger = LoggerFactory.getLogger(PostController::class.java)

    @PostMapping
    fun createPost(@RequestBody request: CreatePostRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val id = createPostUseCase.execute(command)
        return ResponseEntity.ok(id.value)
    }

    @PutMapping
    fun updatePost(@RequestBody request: UpdatePostRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val postId = updatePostUseCase.execute(command)
        return ResponseEntity.ok(postId.value)
    }

    @GetMapping
    fun listPosts(
        @RequestParam(required = false) cursorPostId: UUID?,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<PostListResponse> {
        logger.debug("cursorPostId {}", cursorPostId)
        val posts: PostListResponse = getPostQueryService.findPostList(cursorPostId, pageSize)
        return ResponseEntity.ok(posts)
    }

    @DeleteMapping("/{id}")
    fun deleteCategory(@PathVariable id: UUID): ResponseEntity<UUID> {
        val categoryId = deletePostUseCase.execute(id)
        return ResponseEntity.ok(categoryId.value)
    }

    @GetMapping("/{id}")
    fun getPost(@PathVariable id: UUID): ResponseEntity<PostResponse> {
        logger.debug("getPost with id {}", id)
        val post: PostResponse = getPostQueryService.findPostById(id)
        return ResponseEntity.ok(post)
    }

    // toCommand メソッド
    private fun CreatePostRequest.toCommand(): CreatePostCommand {
        return CreatePostCommand(
            language = this.language,
            title = this.title,
            content = this.content,
            status = this.status,
            featuredImageId = this.featuredImageId,
            categoryId = this.categoryId,
            tagNames = this.tagNames,
        )
    }

    private fun UpdatePostRequest.toCommand(): UpdatePostCommand {
        return UpdatePostCommand(
            id = this.id,
            language = this.language,
            title = this.title,
            content = this.content,
            status = this.status,
            featuredImageId = this.featuredImageId,
            categoryId = this.categoryId,
            tagNames = this.tagNames,
            excerpt = this.excerpt,
            slug = this.slug,
        )
    }
}

package com.headblog.backend.infra.api.admin.post

import com.headblog.backend.app.usecase.post.command.create.CreatePostCommand
import com.headblog.backend.app.usecase.post.command.create.CreatePostUseCase
import com.headblog.backend.app.usecase.post.query.GetPostQueryService
import com.headblog.backend.app.usecase.post.query.PostListDto
import com.headblog.backend.infra.api.admin.post.request.CreatePostRequest
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/admin/posts")
class PostController(
    private val createPostUseCase: CreatePostUseCase,
    private val getPostQueryService: GetPostQueryService
) {

    private val logger = LoggerFactory.getLogger(PostController::class.java)

    @PostMapping("/post")
    fun createPost(@RequestBody request: CreatePostRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val id = createPostUseCase.execute(command)
        return ResponseEntity.ok(id.value)
    }

    @GetMapping("/list")
    fun getPosts(
        @RequestParam(required = false) cursorPostId: UUID?,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<PostListDto> {
        logger.info("cursorPostId $cursorPostId")
        val posts: PostListDto = getPostQueryService.findPostList(cursorPostId, pageSize)
        return ResponseEntity.ok(posts)
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

package com.headblog.backend.app.usecase.post.command.update

import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.shared.exception.AppConflictException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UpdatePostService(
    private val postRepository: PostRepository,
    private val postCategoryRepository: PostCategoryRepository,
) : UpdatePostUseCase {

    private val logger = LoggerFactory.getLogger(UpdatePostService::class.java)

    override fun execute(command: UpdatePostCommand): PostId {

        postRepository.findById(command.id)
            ?: throw AppConflictException("Post with ID ${command.id} not found")

        postRepository.findBySlug(command.slug)?.let { existingDto ->
            if (existingDto.id != command.id) {
                throw AppConflictException(
                    "The post with slug '${command.slug}' already exists and belongs to a different post."
                )
            }
        }

        val post = Post.fromCommand(
            id = command.id,
            title = command.title,
            slug = command.slug,
            content = command.content,
            excerpt = command.excerpt,
            postStatus = command.postStatus,
            featuredImageId = command.featuredImageId,
            metaTitle = command.metaTitle,
            metaDescription = command.metaDescription,
            metaKeywords = command.metaKeywords,
            ogTitle = command.ogTitle,
            ogDescription = command.ogDescription,
            categoryId = command.categoryId,
        )

        postRepository.update(post)
        postCategoryRepository.updateRelation(post.id, post.categoryId)
        return post.id
    }
}
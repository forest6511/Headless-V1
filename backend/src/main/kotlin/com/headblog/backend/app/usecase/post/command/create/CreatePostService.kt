package com.headblog.backend.app.usecase.post.command.create

import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.domain.model.post.PostTaxonomyRepository
import com.headblog.backend.shared.exception.AppConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CreatePostService(
    private val idGenerator: IdGenerator<EntityId>,
    private val postRepository: PostRepository,
    private val postTaxonomyRepository: PostTaxonomyRepository,
) : CreatePostUseCase {

    private val logger = LoggerFactory.getLogger(CreatePostService::class.java)

    override fun execute(command: CreatePostCommand): PostId {

        postRepository.findBySlug(command.slug)?.let {
            val message = "The post with slug '${command.slug}' already exists."
            logger.error(message)
            throw AppConflictException(message)
        }

        val post = Post.create(
            id = idGenerator,
            title = command.title,
            slug = command.slug,
            content = command.content,
            excerpt = command.excerpt,
            postStatus = command.postStatus,
            featuredImageId = command.featuredImageId,
            metaTitle = command.metaTitle,
            metaDescription = command.metaDescription,
            metaKeywords = command.metaKeywords,
            robotsMetaTag = command.robotsMetaTag,
            ogTitle = command.ogTitle,
            ogDescription = command.ogDescription,
            categoryId = command.categoryId,
        )

        postRepository.save(post)
        postTaxonomyRepository.addRelation(post.id, post.categoryId)
        return post.id
    }
}
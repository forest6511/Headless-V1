package com.headblog.backend.app.usecase.post.command.create

import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.domain.model.post.PostTagsRepository
import com.headblog.backend.domain.model.tag.Tag
import com.headblog.backend.domain.model.tag.TagId
import com.headblog.backend.domain.model.tag.TagRepository
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
    private val tagRepository: TagRepository,
    private val postTagsRepository: PostTagsRepository
) : CreatePostUseCase {

    private val logger = LoggerFactory.getLogger(CreatePostService::class.java)

    override fun execute(command: CreatePostCommand): PostId {
        postRepository.findBySlug(command.slug)?.also {
            throw AppConflictException("The post with slug '${command.slug}' already exists.")
        }

        val post = createPost(command)
        postRepository.save(post)

        command.tagNames.forEach { tagName ->
            val tagId = tagRepository.findByName(tagName)?.let { TagId(it.id) } ?: createAndSaveTag(tagName)
            postTagsRepository.addTagToPost(post.id, tagId)
        }

        return post.id
    }

    private fun createPost(command: CreatePostCommand): Post = Post.create(
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
        ogTitle = command.ogTitle,
        ogDescription = command.ogDescription,
        categoryId = command.categoryId
    )

    private fun createAndSaveTag(name: String): TagId {
        val tag = Tag.create(idGenerator, name)
        tagRepository.save(tag)
        return tag.id
    }
}

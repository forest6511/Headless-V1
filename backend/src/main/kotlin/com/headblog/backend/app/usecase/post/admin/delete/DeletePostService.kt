package com.headblog.backend.app.usecase.post.admin.delete

import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.admin.PostRepository
import com.headblog.backend.domain.model.post.admin.PostTagsRepository
import com.headblog.backend.domain.model.tag.TagId
import com.headblog.backend.domain.model.tag.TagRepository
import com.headblog.backend.shared.exceptions.AppConflictException
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class DeletePostService(
    private val postRepository: PostRepository,
    private val postCategoryRepository: PostCategoryRepository,
    private val tagRepository: TagRepository,
    private val postTagsRepository: PostTagsRepository
) : DeletePostUseCase {

    private val logger = LoggerFactory.getLogger(DeletePostService::class.java)

    override fun execute(deleteId: UUID): PostId {
        val postDto = postRepository.findById(deleteId)
            ?: throw AppConflictException("Post with ID $deleteId not found")

        val post = Post.fromCommand(
            id = postDto.id,
            slug = postDto.slug,
            featuredImageId = postDto.featuredImageId,
            categoryId = postDto.categoryId,
            translations = emptyList()
        )

        // category
        postCategoryRepository.deleteRelation(post.id, post.categoryId)

        // tags
        postDto.tags.forEach { tagDto ->
            val tagId = TagId(tagDto.id)
            postTagsRepository.removeTagFromPost(post.id, tagId)
            if (postTagsRepository.findPostsByTagId(tagId).isEmpty()) {
                tagRepository.delete(tagId)
            }
        }

        // post
        postRepository.delete(post)
        return post.id
    }
}
package com.headblog.backend.app.usecase.post.command.update

import com.headblog.backend.app.usecase.tag.query.TagDto
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
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
class UpdatePostService(
    private val idGenerator: IdGenerator<EntityId>,
    private val postRepository: PostRepository,
    private val postCategoryRepository: PostCategoryRepository,
    private val tagRepository: TagRepository,
    private val postTagsRepository: PostTagsRepository
) : UpdatePostUseCase {

    private val logger = LoggerFactory.getLogger(UpdatePostService::class.java)

    override fun execute(command: UpdatePostCommand): PostId {
        val originalPost = postRepository.findById(command.id)
            ?: throw AppConflictException("Post with ID ${command.id} not found.")

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

        // post
        postRepository.update(post)
        // category
        postCategoryRepository.updateRelation(post.id, post.categoryId)
        // tags
        updateTags(originalPost.tags, command.tagNames, post.id)

        return post.id
    }

    private fun updateTags(originalTags: List<TagDto>, newTagNames: Set<String>, postId: PostId) {
        val newTagNamesSet = newTagNames.map(String::trim).toSet()
        val originalTagNames = originalTags.map(TagDto::name).toSet()

        // 削除するタグの処理: オリジナルにはあって新規リクエストにはないタグ
        originalTags.filterNot { it.name in newTagNamesSet }.forEach { tagDto ->
            val tagId = TagId(tagDto.id)
            postTagsRepository.removeTagFromPost(postId, tagId)
            if (postTagsRepository.findPostsByTagId(tagId).isEmpty()) {
                tagRepository.delete(tagId)
            }
        }

        // 追加するタグの処理: 新規リクエストにはあってオリジナルにはないタグ
        newTagNamesSet.filterNot { it in originalTagNames }.forEach { tagName ->
            val tag = tagRepository.findByName(tagName) ?: createAndSaveTag(tagName)
            postTagsRepository.addTagToPost(postId, TagId(tag.id))
        }
    }

    private fun createAndSaveTag(tagName: String): TagDto {
        val newTag = Tag.create(idGenerator, tagName)
        tagRepository.save(newTag)
        return TagDto(id = newTag.id.value, name = newTag.name, slug = newTag.slug)
    }
}
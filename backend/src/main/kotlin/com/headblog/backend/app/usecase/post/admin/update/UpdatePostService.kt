package com.headblog.backend.app.usecase.post.admin.update

import com.headblog.backend.app.usecase.tag.query.TagDto
import com.headblog.backend.domain.model.post.Language
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.Status
import com.headblog.backend.domain.model.post.Translation
import com.headblog.backend.domain.model.post.admin.PostRepository
import com.headblog.backend.domain.model.post.admin.PostTagsRepository
import com.headblog.backend.domain.model.tag.Tag
import com.headblog.backend.domain.model.tag.TagId
import com.headblog.backend.domain.model.tag.TagRepository
import com.headblog.backend.shared.exceptions.AppConflictException
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

        val originalPostDto = postRepository.findById(command.id)
            ?: throw AppConflictException("Post with ID ${command.id} not found.")

        val translation = Translation(
            language = Language.of(command.language),
            status = Status.of(command.status),
            title = command.title,
            excerpt = command.excerpt,
            content = command.content
        )

        val post = Post.fromCommand(
            id = command.id,
            slug = command.slug,
            featuredImageId = command.featuredImageId,
            categoryId = command.categoryId,
            translations = listOf(translation)
        )

        // 投稿を更新
        postRepository.update(post)
        // カテゴリを更新
        postCategoryRepository.updateRelation(post.id, post.categoryId)
        // タグを更新
        updateTags(originalPostDto.tags, command.tagNames, post.id)

        return post.id
    }

    /**
     * タグの更新
     * - オリジナルにあったがリクエストにないタグは削除
     * - リクエストにあってオリジナルにないタグは追加
     */
    private fun updateTags(
        originalTags: List<TagDto>,
        newTagNames: Set<String>,
        postId: PostId
    ) {
        val newTagNamesSet = newTagNames.map(String::trim).toSet()
        val originalTagNames = originalTags.map(TagDto::name).toSet()

        originalTags.filterNot { it.name in newTagNamesSet }.forEach { tagDto ->
            val tagId = TagId(tagDto.id)
            postTagsRepository.removeTagFromPost(postId, tagId)
            if (postTagsRepository.findPostsByTagId(tagId).isEmpty()) {
                tagRepository.delete(tagId)
            }
        }

        newTagNamesSet.filterNot { it in originalTagNames }.forEach { tagName ->
            val tag = tagRepository.findByName(tagName) ?: createAndSaveTag(tagName)
            postTagsRepository.addTagToPost(postId, TagId(tag.id))
        }
    }

    /**
     * 新規タグを作成して保存 -> TagDto を返す
     */
    private fun createAndSaveTag(tagName: String): TagDto {
        val newTag = Tag.create(idGenerator, tagName)
        tagRepository.save(newTag)
        return TagDto(id = newTag.id.value, name = newTag.name, slug = newTag.slug)
    }
}

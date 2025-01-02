package com.headblog.backend.app.usecase.post.command.create

import com.headblog.backend.app.usecase.translation.TranslationService
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
class CreatePostService(
    private val idGenerator: IdGenerator<EntityId>,
    private val postRepository: PostRepository,
    private val postCategoryRepository: PostCategoryRepository,
    private val tagRepository: TagRepository,
    private val postTagsRepository: PostTagsRepository,
    private val translationService: TranslationService  // 追加
) : CreatePostUseCase {

    private val logger = LoggerFactory.getLogger(CreatePostService::class.java)

    override fun execute(command: CreatePostCommand): PostId {
        postRepository.findBySlug(command.slug)?.also {
            throw AppConflictException("The post with slug '${command.slug}' already exists.")
        }

        // コンテンツを翻訳
        val translatedContent = translationService.translateToEnglish(command.content)
            .getOrElse {
                logger.error("Translation failed, using original content", it)
                command.content
            }

        logger.info("オリジナル　${command.content}")
        logger.info("翻訳　$translatedContent")

        // 翻訳したコンテンツでPostを作成
        val post = createPost(command.copy(content = translatedContent))
        postRepository.save(post)
        postCategoryRepository.addRelation(post.id, post.categoryId)

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

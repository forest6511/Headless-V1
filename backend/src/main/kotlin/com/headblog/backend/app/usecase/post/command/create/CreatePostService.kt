package com.headblog.backend.app.usecase.post.command.create

import com.headblog.backend.app.usecase.translation.TranslationService
import com.headblog.backend.domain.model.post.Language
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.domain.model.post.PostTagsRepository
import com.headblog.backend.domain.model.post.PostTranslation
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
    private val translationService: TranslationService
) : CreatePostUseCase {

    private val logger = LoggerFactory.getLogger(CreatePostService::class.java)

    override fun execute(command: CreatePostCommand): PostId {
        // スラッグ重複チェック
        postRepository.findBySlug(command.slug)?.also {
            throw AppConflictException("The post with slug '${command.slug}' already exists.")
        }

        // --- 以下、コメントアウトされた翻訳コードはそのまま残し、現在は使わない例 ---
//        // コンテンツを翻訳
//        val translatedContent = translationService.translateToEnglish(command.content)
//            .getOrElse {
//                logger.error("Translation failed, using original content", it)
//                command.content
//            }
//
//        logger.info("オリジナル　${command.content}")
//        logger.info("翻訳　$translatedContent")
//
//        // 翻訳したコンテンツでPostを作成
//        val post = createPost(command.copy(content = translatedContent))

        // 現状の実装では、翻訳せずにそのまま投稿を作成
        val post = createPost(command)
        postRepository.save(post)
        postCategoryRepository.addRelation(post.id, post.categoryId)

        // タグを紐づける
        command.tagNames.forEach { tagName ->
            val tagId = tagRepository.findByName(tagName)?.let { TagId(it.id) }
                ?: createAndSaveTag(tagName)
            postTagsRepository.addTagToPost(post.id, tagId)
        }

        return post.id
    }

    /**
     * CreatePostCommand から、ドメインの Post を生成
     * - 多言語対応のため、title / content / excerpt / language を translations にまとめる
     */
    private fun createPost(command: CreatePostCommand): Post {
        return Post.create(
            id = idGenerator,
            slug = command.slug,
            status = command.status,
            featuredImageId = command.featuredImageId,
            categoryId = command.categoryId,
            translations = listOf(
                PostTranslation(
                    language = Language.of(command.language),
                    title = command.title,
                    excerpt = command.excerpt,
                    content = command.content
                )
            )
        )
    }

    /**
     * 新規タグを作成して保存
     */
    private fun createAndSaveTag(name: String): TagId {
        val tag = Tag.create(idGenerator, name)
        tagRepository.save(tag)
        return tag.id
    }
}
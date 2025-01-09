package com.headblog.backend.app.usecase.post.command.create

import com.headblog.backend.app.usecase.translation.TranslationService
import com.headblog.backend.domain.model.post.Language
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.domain.model.post.PostTagsRepository
import com.headblog.backend.domain.model.post.Translation
import com.headblog.backend.domain.model.tag.Tag
import com.headblog.backend.domain.model.tag.TagId
import com.headblog.backend.domain.model.tag.TagRepository
import com.headblog.backend.shared.exception.AppConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.util.*
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
    private val logger = LoggerFactory.getLogger(javaClass)

    companion object {
        private const val SLUG_MAX_LENGTH = 50
        private const val RANDOM_SUFFIX_LENGTH = 8
    }

    override fun execute(command: CreatePostCommand): PostId {
        logger.info("Creating new post with title: ${command.title}")

        // 英語翻訳と要約の生成
        val englishTitle = translate {
            translationService.translateTitleToEnglish(command.title)
        }
        val englishContent = translate {
            translationService.translateToEnglish(command.content)
        }
        val japaneseSummary = translate {
            translationService.summarizeJapaneseContent(command.content)
        }
        val englishSummary = translate {
            translationService.translateSummarizeToEnglish(japaneseSummary)
        }

        logger.debug("英語翻訳タイトル: $englishTitle")
        logger.debug("英語タイトルの文字数: ${englishTitle.length}文字")
        logger.debug("英語に翻訳されたコンテンツ: $englishContent")
        logger.debug("英語コンテンツの文字数: ${englishContent.length}文字")
        logger.debug("日本語の要約: $japaneseSummary")
        logger.debug("日本語要約の文字数: ${japaneseSummary.length}文字")
        logger.debug("英語の要約: $englishSummary")
        logger.debug("英語要約の文字数: ${englishSummary.length}文字")

        // slugの生成
        val slug = generateSlug(englishTitle)

        // 日本語版と英語版のPostを作成
        val post = Post.create(
            id = idGenerator,
            slug = slug,
            status = command.status,
            featuredImageId = command.featuredImageId,
            categoryId = command.categoryId,
            translations = listOf(
                Translation(
                    language = Language.of("ja"),
                    title = command.title,
                    content = command.content,
                    excerpt = japaneseSummary
                ),
                Translation(
                    language = Language.of("en"),
                    title = englishTitle,
                    content = englishContent,
                    excerpt = englishSummary
                )
            )
        )

        // 投稿、カテゴリの登録
        postRepository.save(post)
        postCategoryRepository.addRelation(post.id, post.categoryId)

        // タグの登録
        command.tagNames.forEach { tagName ->
            val tagId = tagRepository.findByName(tagName)?.let { TagId(it.id) }
                ?: createAndSaveTag(tagName)
            postTagsRepository.addTagToPost(post.id, tagId)
        }

        logger.info("Post created successfully with ID: ${post.id} and slug: $slug")
        return post.id
    }

    private fun translate(block: () -> Result<String>): String {
        return block().getOrElse {
            logger.error("Translation failed", it)
            throw AppConflictException("Translation failed")
        }.also {
            Thread.sleep(2000) // 2秒間のスリープ
        }
    }

    private fun generateSlug(englishTitle: String): String {
        val baseSlug = englishTitle
            .lowercase()
            .replace(Regex("[^a-z0-9\\s]"), "") // 英数字とスペース以外を削除
            .replace(Regex("\\s+"), "-") // スペースをハイフンに変換
            .take(SLUG_MAX_LENGTH) // スラッグの最大長を制限
            .trim('-') // 先頭と末尾のハイフンを削除

        val randomSuffix = UUID.randomUUID().toString().take(RANDOM_SUFFIX_LENGTH)
        return "$baseSlug-$randomSuffix"
    }

    private fun createAndSaveTag(name: String): TagId {
        val tag = Tag.create(idGenerator, name)
        tagRepository.save(tag)
        return tag.id
    }
}
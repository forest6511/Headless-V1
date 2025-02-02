package com.headblog.backend.app.usecase.post.admin.create

import com.headblog.backend.app.usecase.translation.TranslationService
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
import com.headblog.backend.shared.constants.LanguageConstants
import com.headblog.backend.shared.exceptions.AppConflictException
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
        private const val RANDOM_SUFFIX_LENGTH = 6
    }

    override fun execute(command: CreatePostCommand): PostId {
        logger.info("Original Post language: ${command.language}")

        val (sourceLang, targetLang) = when (command.language) {
            LanguageConstants.JA -> LanguageConstants.JA to LanguageConstants.EN
            LanguageConstants.EN -> LanguageConstants.EN to LanguageConstants.JA
            else -> throw IllegalArgumentException("Unsupported language: ${command.language}")
        }

        // 翻訳と要約の生成
        val translatedTitle = translate {
            translationService.translateTitle(command.title, targetLang)
        }
        val translatedContent = translate {
            translationService.translate(command.content, targetLang)
        }
        val sourceSummary = translate {
            translationService.summarizeContent(command.content, sourceLang)
        }
        val translatedSummary = translate {
            translationService.translateSummary(sourceSummary, targetLang)
        }

        logger.debug("オリジナル言語: ${command.language}")
        logger.debug("タイトル: ${command.title}")
        logger.debug("翻訳タイトル: $translatedTitle")
        logger.debug("翻訳タイトルの文字数: ${translatedTitle.length}文字")
        logger.debug("コンテンツ: ${command.content}")
        logger.debug("翻訳されたコンテンツ: $translatedContent")
        logger.debug("翻訳コンテンツの文字数: ${translatedContent.length}文字")
        logger.debug("元言語の要約: $sourceSummary")
        logger.debug("元言語要約の文字数: ${sourceSummary.length}文字")
        logger.debug("翻訳された要約: $translatedSummary")
        logger.debug("翻訳要約の文字数: ${translatedSummary.length}文字")

        // 常に英語のSlugを生成
        val slug = generateSlug(if (sourceLang == LanguageConstants.JA) translatedTitle else command.title)

        // 投稿を作成
        val post = Post.create(
            id = idGenerator,
            slug = slug,
            featuredImageId = command.featuredImageId,
            categoryId = command.categoryId,
            translations = listOf(
                Translation(
                    language = Language.of(sourceLang),
                    status = Status.of(command.status),
                    title = command.title,
                    content = command.content,
                    excerpt = sourceSummary
                ),
                Translation(
                    language = Language.of(targetLang),
                    // 投稿記事作成時は、翻訳確認の為にステータスはDRAFT
                    status = Status.DRAFT,
                    title = translatedTitle,
                    content = translatedContent,
                    excerpt = translatedSummary
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
        }
    }

    private fun generateSlug(title: String): String {
        val baseSlug = title
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
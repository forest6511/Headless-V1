package com.headblog.backend.infra.api.client.category.query

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.GetClientCategoryArticlesQueryService
import com.headblog.backend.app.usecase.post.PostDto
import com.headblog.backend.domain.model.category.admin.CategoryRepository
import com.headblog.backend.domain.model.category.client.CategoryClientRepository
import com.headblog.backend.infra.api.admin.media.response.MediaTranslationResponse
import com.headblog.backend.infra.api.admin.post.response.FeaturedImageResponse
import com.headblog.backend.infra.api.admin.post.response.withFullUrls
import com.headblog.backend.infra.api.client.category.response.CategoryDetailClientResponse
import com.headblog.backend.infra.api.client.category.response.CategoryWithArticlesClientResponse
import com.headblog.backend.infra.api.client.category.response.ParentCategoryClientResponse
import com.headblog.backend.infra.api.client.post.response.CategoryClientResponse
import com.headblog.backend.infra.api.client.post.response.PostClientResponse
import com.headblog.backend.infra.api.common.query.CategoryPathBuilder
import com.headblog.backend.infra.config.StorageProperties
import com.headblog.backend.shared.exceptions.AppConflictException
import org.springframework.stereotype.Service

@Service
class GetClientCategoryArticlesQueryServiceImpl(
    private val categoryClientRepository: CategoryClientRepository,
    private val categoryRepository: CategoryRepository,
    private val storageProperties: StorageProperties,
    private val categoryPathBuilder: CategoryPathBuilder
) : GetClientCategoryArticlesQueryService {

    // translations.first()の安全なアクセスを提供し、存在しない場合は適切なエラーをスロー
    private val CategoryDto.firstTranslation
        get() = translations.firstOrNull()
            ?: throw AppConflictException("No translation found for category: $id")

    // 記事の翻訳データへの安全なアクセスを提供
    private val PostDto.firstTranslation
        get() = translations.firstOrNull()
            ?: throw AppConflictException("No translation found for post: $id")

    override fun getCategoryArticles(
        categoryPath: String,
        language: String,
        pageSize: Int
    ): CategoryWithArticlesClientResponse {
        // URLパスからカテゴリスラグを取得
        val slugs = categoryPath.split("/")

        // 指定されたパスとロケールでカテゴリを検索
        val category = categoryClientRepository.findCategoryByPath(slugs, language)
            ?: throw AppConflictException("Category not found: $categoryPath")

        // パスの深さに応じて適切な記事取得戦略を選択
        // slugs.size == 1: 親カテゴリの場合は子カテゴリの記事も含めて取得
        // それ以外: 指定されたカテゴリの記事のみ取得
        val posts = when (slugs.size) {
            1 -> categoryClientRepository.findPublishedPostsByParentCategorySlug(
                parentSlug = slugs.first(),
                language = language,
                pageSize = pageSize
            )

            else -> categoryClientRepository.findPublishedPostsByCategorySlug(
                slug = slugs.last(),
                language = language,
                pageSize = pageSize
            )
        }

        // レスポンスの作成
        return CategoryWithArticlesClientResponse(
            category = category.toDetailResponse(language),
            articles = posts.map { it.toClientResponse(language) }
        )
    }

    // カテゴリDTOをクライアントレスポンス形式に変換
    private fun CategoryDto.toDetailResponse(language: String) = CategoryDetailClientResponse(
        id = id,
        slug = slug,
        name = firstTranslation.name,
        description = firstTranslation.description,
        parent = parentId?.let { parentId ->
            categoryRepository.findByIdAndLanguage(parentId, language)?.toParentResponse()
        }
    )

    // カテゴリDTOを親カテゴリレスポンス形式に変換
    private fun CategoryDto.toParentResponse() = ParentCategoryClientResponse(
        id = id,
        slug = slug,
        name = firstTranslation.name,
        description = firstTranslation.description
    )

    // 記事DTOをクライアントレスポンス形式に変換
    private fun PostDto.toClientResponse(language: String) = PostClientResponse(
        slug = slug,
        title = firstTranslation.title,
        description = firstTranslation.excerpt,
        createdAt = createdAt.toString(),
        updatedAt = updatedAt.toString(),
        tags = tags.map { it.slug },
        featuredImage = featuredImage?.let {
            FeaturedImageResponse(
                id = it.id,
                thumbnailUrl = it.thumbnailUrl,
                mediumUrl = it.mediumUrl,
                translations = it.translations.map { translation ->
                    MediaTranslationResponse(
                        language = translation.language,
                        title = translation.title
                    )
                }
            ).withFullUrls(storageProperties.cloudflare.r2.publicEndpoint)
        },
        category = CategoryClientResponse(
            path = categoryPathBuilder.buildPath(categoryId, language)
        )
    )
}
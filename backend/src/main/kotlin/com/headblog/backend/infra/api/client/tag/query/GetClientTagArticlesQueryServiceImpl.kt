package com.headblog.backend.infra.api.client.tag.query

import com.headblog.backend.app.usecase.tag.query.GetClientTagArticlesQueryService
import com.headblog.backend.domain.model.tag.TagRepository
import com.headblog.backend.infra.api.admin.media.response.MediaTranslationResponse
import com.headblog.backend.infra.api.admin.post.response.FeaturedImageResponse
import com.headblog.backend.infra.api.admin.post.response.withFullUrls
import com.headblog.backend.infra.api.client.post.response.CategoryClientResponse
import com.headblog.backend.infra.api.client.post.response.PostDetailClientResponse
import com.headblog.backend.infra.api.client.tag.response.TagClientResponse
import com.headblog.backend.infra.api.common.query.CategoryPathBuilder
import com.headblog.backend.infra.config.StorageProperties
import com.headblog.backend.shared.exceptions.AppConflictException
import org.springframework.stereotype.Service

@Service
class GetClientTagArticlesQueryServiceImpl(
    private val tagRepository: TagRepository,
    private val categoryPathBuilder: CategoryPathBuilder,
    private val storageProperties: StorageProperties,
) : GetClientTagArticlesQueryService {
    override fun getTagArticles(
        name: String,
        language: String,
        pageSize: Int
    ): TagClientResponse {
        // タグ情報の取得
        val tagDto = tagRepository.findByName(name)
            ?: throw AppConflictException("Tag not found: $name")

        // 記事の取得
        val posts = tagRepository.findPublishedPostsByTagName(name, language, pageSize)
        // PostDtoからPostDetailClientResponseへの変換
        val postResponses = posts.map { post ->
            PostDetailClientResponse(
                slug = post.slug,
                title = post.translations.first().title,
                content = post.translations.first().content,
                description = post.translations.first().excerpt,
                createdAt = post.createdAt.toString(),
                updatedAt = post.updatedAt.toString(),
                tags = post.tags.map { it.name },
                featuredImage = post.featuredImage?.let {
                    FeaturedImageResponse(
                        id = it.id,
                        thumbnailUrl = it.thumbnailUrl,
                        smallUrl = it.smallUrl,
                        largeUrl = it.largeUrl,
                        translations = it.translations.map { translation ->
                            MediaTranslationResponse(
                                language = translation.language,
                                title = translation.title
                            )
                        }
                    ).withFullUrls(storageProperties.cloudflare.r2.publicEndpoint)
                },
                category = CategoryClientResponse(
                    path = categoryPathBuilder.buildPath(post.categoryId, language)
                )
            )
        }

        return TagClientResponse(
            name = tagDto.name,
            slug = tagDto.slug,
            articles = postResponses
        )
    }
}
package com.headblog.backend.infra.api.client.post.query

import com.headblog.backend.app.usecase.post.client.qeury.GetClientPostQueryService
import com.headblog.backend.domain.model.post.client.PostClientRepository
import com.headblog.backend.infra.api.admin.media.response.MediaTranslationResponse
import com.headblog.backend.infra.api.admin.post.response.FeaturedImageResponse
import com.headblog.backend.infra.api.admin.post.response.withFullUrls
import com.headblog.backend.infra.api.client.post.response.CategoryClientResponse
import com.headblog.backend.infra.api.client.post.response.PostClientResponse
import com.headblog.backend.infra.api.client.post.response.PostDetailClientResponse
import com.headblog.backend.infra.api.common.query.CategoryPathBuilder
import com.headblog.backend.infra.config.StorageProperties
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class GetClientPostQueryServiceImpl(
    private val postClientRepository: PostClientRepository,
    private val categoryPathBuilder: CategoryPathBuilder,
    private val storageProperties: StorageProperties,
) : GetClientPostQueryService {

    private val logger = LoggerFactory.getLogger(GetClientPostQueryServiceImpl::class.java)

    override fun findPublishedPosts(
        language: String,
        cursorPostId: UUID?,
        pageSize: Int
    ): List<PostClientResponse> {
        val response = postClientRepository.findPublishedPosts(language, cursorPostId, pageSize)
            .map { post ->
                val translation = post.translations.first()
                PostClientResponse(
                    slug = post.slug,
                    title = translation.title,
                    description = translation.excerpt,
                    createdAt = post.createdAt.toString(),
                    updatedAt = post.updatedAt.toString(),
                    tags = post.tags.map { it.slug },
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
        return response
    }

    override fun findPublishedPostBySlug(
        language: String,
        slug: String
    ): PostDetailClientResponse {
        val response = postClientRepository.findPublishedPostBySlug(language, slug)?.let { post ->
            val translation = post.translations.first()
            PostDetailClientResponse(
                slug = post.slug,
                title = translation.title,
                content = translation.content,
                description = translation.excerpt,
                createdAt = post.createdAt.toString(),
                updatedAt = post.updatedAt.toString(),
                tags = post.tags.map { it.slug },
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
        return checkNotNull(response)
    }
}
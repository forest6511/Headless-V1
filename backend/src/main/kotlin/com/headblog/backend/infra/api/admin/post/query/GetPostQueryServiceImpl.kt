package com.headblog.backend.infra.api.admin.post.query

import com.headblog.backend.app.usecase.post.PostDto
import com.headblog.backend.app.usecase.post.PostTranslationDto
import com.headblog.backend.app.usecase.post.admin.query.GetPostQueryService
import com.headblog.backend.domain.model.post.admin.PostRepository
import com.headblog.backend.infra.api.admin.media.response.MediaTranslationResponse
import com.headblog.backend.infra.api.admin.post.response.FeaturedImageResponse
import com.headblog.backend.infra.api.admin.post.response.PostListResponse
import com.headblog.backend.infra.api.admin.post.response.PostResponse
import com.headblog.backend.infra.api.admin.post.response.PostTranslationResponse
import com.headblog.backend.infra.api.admin.post.response.withFullUrls
import com.headblog.backend.infra.config.StorageProperties
import com.headblog.backend.shared.exceptions.AppConflictException
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service


@Service
class GetPostQueryServiceImpl(
    private val postRepository: PostRepository,
    private val storageProperties: StorageProperties,
) : GetPostQueryService {

    private val logger = LoggerFactory.getLogger(GetPostQueryServiceImpl::class.java)
    override fun findPostList(cursorPostId: UUID?, pageSize: Int): PostListResponse {
        // 総件数を取得
        val totalCount = postRepository.count()

        // 総ページ数を計算
        val totalPages = if (totalCount == 0) 0 else (totalCount + pageSize - 1) / pageSize

        // 投稿リストを取得
        val posts = postRepository.findAll(cursorPostId, pageSize).map { dto -> toPostResponse(dto) }

        return PostListResponse(
            totalCount = totalCount,
            posts = posts,
            totalPages = totalPages,
            pageSize = pageSize
        )
    }


    override fun findPostById(postId: UUID): PostResponse {
        return postRepository.findById(postId)?.let { dto ->
            toPostResponse(dto)
        } ?: throw AppConflictException("Post not found. id: $postId")
    }

    private fun toTranslationResponse(t: PostTranslationDto): PostTranslationResponse {
        return PostTranslationResponse(
            language = t.language,
            status = t.status,
            title = t.title,
            excerpt = t.excerpt,
            content = t.content
        )
    }

    private fun toPostResponse(dto: PostDto): PostResponse {
        return PostResponse(
            id = dto.id,
            slug = dto.slug,
            featuredImageId = dto.featuredImageId,
            featuredImage = dto.featuredImage?.let {
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
            categoryId = dto.categoryId,
            tags = dto.tags,
            translations = dto.translations.map { toTranslationResponse(it) },
            createdAt = dto.createdAt,
            updatedAt = dto.updatedAt
        )
    }
}

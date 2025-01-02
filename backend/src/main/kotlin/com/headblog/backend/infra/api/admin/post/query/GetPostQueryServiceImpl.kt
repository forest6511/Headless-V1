package com.headblog.backend.infra.api.admin.post.query

import com.headblog.backend.app.usecase.post.query.GetPostQueryService
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.infra.api.admin.post.response.PostListResponse
import com.headblog.backend.infra.api.admin.post.response.PostResponse
import com.headblog.backend.infra.api.admin.post.response.TranslationResponse
import com.headblog.backend.shared.exception.AppConflictException
import java.util.*
import org.springframework.stereotype.Service

@Service
class GetPostQueryServiceImpl(
    private val postRepository: PostRepository
) : GetPostQueryService {

    override fun findPostList(cursorPostId: UUID?, pageSize: Int): PostListResponse {
        // 総件数を取得
        val totalCount = postRepository.count()

        // 総ページ数を計算
        val totalPages = if (totalCount == 0) 0 else (totalCount + pageSize - 1) / pageSize

        // 投稿リストを取得
        val posts = postRepository.findAll(cursorPostId, pageSize).map { dto ->
            PostResponse(
                id = dto.id,
                slug = dto.slug,
                status = dto.status,
                featuredImageId = dto.featuredImageId,
                categoryId = dto.categoryId,
                tags = dto.tags,
                translations = dto.translations.map { toTranslationResponse(it) },
                createdAt = dto.createdAt,
                updatedAt = dto.updatedAt
            )
        }

        return PostListResponse(
            totalCount = totalCount,
            posts = posts,
            totalPages = totalPages,
            pageSize = pageSize
        )
    }

    override fun findPostById(postId: UUID): PostResponse {
        return postRepository.findById(postId)?.let { dto ->
            PostResponse(
                id = dto.id,
                slug = dto.slug,
                status = dto.status,
                featuredImageId = dto.featuredImageId,
                categoryId = dto.categoryId,
                tags = dto.tags,
                translations = dto.translations.map { toTranslationResponse(it) },
                createdAt = dto.createdAt,
                updatedAt = dto.updatedAt
            )
        } ?: throw AppConflictException("Post not found. id: $postId")
    }

    private fun toTranslationResponse(t: com.headblog.backend.app.usecase.post.query.TranslationDto): TranslationResponse {
        return TranslationResponse(
            language = t.language,
            title = t.title,
            excerpt = t.excerpt,
            content = t.content
        )
    }
}

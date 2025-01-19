package com.headblog.backend.infra.api.admin.post.query

import com.headblog.backend.app.usecase.post.query.GetPostQueryService
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.infra.api.admin.post.response.PostListResponse
import com.headblog.backend.infra.api.admin.post.response.PostResponse
import com.headblog.backend.infra.api.admin.post.response.TranslationResponse
import com.headblog.backend.infra.api.client.post.response.CategoryClientResponse
import com.headblog.backend.infra.api.client.post.response.CategoryPathDto
import com.headblog.backend.infra.api.client.post.response.PostClientResponse
import com.headblog.backend.infra.api.client.post.response.PostDetailClientResponse
import com.headblog.backend.shared.exceptions.AppConflictException
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class GetPostQueryServiceImpl(
    private val postRepository: PostRepository,
    private val categoryRepository: CategoryRepository,
) : GetPostQueryService {

    private val logger = LoggerFactory.getLogger(GetPostQueryServiceImpl::class.java)
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
                featuredImageId = dto.featuredImageId,
                categoryId = dto.categoryId,
                tags = dto.tags,
                translations = dto.translations.map { toTranslationResponse(it) },
                createdAt = dto.createdAt,
                updatedAt = dto.updatedAt
            )
        } ?: throw AppConflictException("Post not found. id: $postId")
    }

    override fun findPublishedPosts(
        language: String,
        cursorPostId: UUID?,
        pageSize: Int
    ): List<PostClientResponse> {
        val response = postRepository.findPublishedPosts(language, cursorPostId, pageSize)
            .map { post ->
                val translation = post.translations.first()
                PostClientResponse(
                    slug = post.slug,
                    title = translation.title,
                    description = translation.excerpt,
                    createdAt = post.createdAt.toString(),
                    updatedAt = post.updatedAt.toString(),
                    tags = post.tags.map { it.slug },
                    category = CategoryClientResponse(
                        path = buildCategoryPath(post.categoryId, language)
                    )
                )
            }
        return response
    }

    override fun findPublishedPostBySlug(
        language: String,
        slug: String
    ): PostDetailClientResponse {
        val response = postRepository.findPublishedPostBySlug(language, slug)?.let { post ->
            val translation = post.translations.first()
            PostDetailClientResponse(
                slug = post.slug,
                title = translation.title,
                content = translation.content,
                description = translation.excerpt,
                createdAt = post.createdAt.toString(),
                updatedAt = post.updatedAt.toString(),
                tags = post.tags.map { it.slug },
                category = CategoryClientResponse(
                    path = buildCategoryPath(post.categoryId, language)
                )
            )
        }
        return checkNotNull(response)
    }


    private fun buildCategoryPath(categoryId: UUID, language: String): List<CategoryPathDto> {
        return generateSequence(categoryId) { currentId ->
            categoryRepository.findByIdAndLanguage(currentId, language)?.parentId
        }
            .mapNotNull { id ->
                categoryRepository.findByIdAndLanguage(id, language)?.let { category ->
                    CategoryPathDto(
                        slug = category.slug,
                        name = category.translations.first().name,
                        description = category.translations.first().description,
                    )
                }
            }
            .toList()
            .reversed()
    }

    private fun toTranslationResponse(t: com.headblog.backend.app.usecase.post.query.TranslationDto): TranslationResponse {
        return TranslationResponse(
            language = t.language,
            status = t.status,
            title = t.title,
            excerpt = t.excerpt,
            content = t.content
        )
    }
}

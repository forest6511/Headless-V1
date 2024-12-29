package com.headblog.backend.infra.api.admin.post.query

import com.headblog.backend.app.usecase.post.query.GetPostQueryService
import com.headblog.backend.app.usecase.post.query.PostListDto
import com.headblog.backend.app.usecase.post.query.PostResponse
import com.headblog.backend.app.usecase.post.query.PostWithCategoryIdResponse
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.shared.exception.AppConflictException
import java.util.*
import org.springframework.stereotype.Service

@Service
class GetPostQueryServiceImpl(
    private val postRepository: PostRepository
) : GetPostQueryService {

    override fun findPostList(cursorPostId: UUID?, pageSize: Int): PostListDto {
        // 総件数を取得
        val totalCount = postRepository.count()

        // 総ページ数を計算
        val totalPages = if (totalCount == 0) 0 else (totalCount + pageSize - 1) / pageSize

        // 投稿リストを取得
        val posts = postRepository.findAll(cursorPostId, pageSize)
            .map {
                val postWithCategoryIdResponse = PostWithCategoryIdResponse(
                    id = it.id,
                    title = it.title,
                    slug = it.slug,
                    content = it.content,
                    excerpt = it.excerpt,
                    postStatus = it.postStatus,
                    featuredImageId = it.featuredImageId,
                    metaTitle = it.metaTitle,
                    metaDescription = it.metaDescription,
                    metaKeywords = it.metaKeywords,
                    ogTitle = it.ogTitle,
                    ogDescription = it.ogDescription,
                    createdAt = it.createdAt,
                    updateAt = it.updateAt,
                    categoryId = it.categoryId,
                    tagNames = it.tags.joinToString { tag -> tag.name }
                )
                postWithCategoryIdResponse
            }

        return PostListDto(
            totalCount = totalCount,
            posts = posts,
            totalPages = totalPages,
            pageSize = pageSize
        )
    }

    override fun findPostById(postId: UUID): PostResponse {
        return postRepository.findById(postId)?.let {
            PostResponse(
                id = it.id,
                title = it.title,
                slug = it.slug,
                content = it.content,
                excerpt = it.excerpt,
                postStatus = it.postStatus,
                featuredImageId = it.featuredImageId,
                metaTitle = it.metaTitle,
                metaDescription = it.metaDescription,
                metaKeywords = it.metaKeywords,
                ogTitle = it.ogTitle,
                ogDescription = it.ogDescription,
                categoryId = it.categoryId,
                tagNames = it.tags.joinToString { it.name }
            )
        } ?: throw AppConflictException("Post not found. id: $postId")
    }
}
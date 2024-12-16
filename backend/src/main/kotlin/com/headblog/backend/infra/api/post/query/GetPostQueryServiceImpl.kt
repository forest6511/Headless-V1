package com.headblog.backend.infra.api.post.query

import com.headblog.backend.app.usecase.post.query.GetPostQueryService
import com.headblog.backend.app.usecase.post.query.PostListDto
import com.headblog.backend.domain.model.post.PostRepository
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

        return PostListDto(
            totalCount = totalCount,
            posts = posts,
            totalPages = totalPages,
            pageSize = pageSize
        )
    }
}
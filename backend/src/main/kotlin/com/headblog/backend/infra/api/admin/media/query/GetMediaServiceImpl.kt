package com.headblog.backend.infra.api.admin.media.query

import com.headblog.backend.app.usecase.media.query.GetMediaService
import com.headblog.backend.domain.model.media.MediaId
import com.headblog.backend.domain.model.media.MediaRepository
import com.headblog.backend.domain.model.user.UserId
import com.headblog.backend.infra.api.admin.media.response.MediaListResponse
import com.headblog.backend.infra.api.admin.media.response.MediaResponse
import com.headblog.backend.infra.api.admin.media.response.MediaTranslationResponse
import com.headblog.backend.infra.api.admin.media.response.withFullUrls
import com.headblog.backend.infra.config.StorageProperties
import java.util.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class GetMediaServiceImpl(
    private val mediaRepository: MediaRepository,
    private val storageProperties: StorageProperties,
) : GetMediaService {

    override fun findMediaList(
        mediaId: UUID?,
        userId: UUID?,
        pageSize: Int
    ): MediaListResponse {

        val cursorMediaId = mediaId?.let(::MediaId)
        val searchUserId = userId?.let(::UserId)

        // リポジトリのfindAllメソッドを使用
        val mediaList = mediaRepository.findAll(
            cursorMediaId = cursorMediaId,
            uploadedBy = searchUserId,
            pageSize = pageSize
        )

        // レスポンスに変換
        val mediaDtoList = mediaList.map { mediaDto ->
            MediaResponse(
                id = mediaDto.id,
                uploadedBy = mediaDto.uploadedBy,
                thumbnailUrl = mediaDto.thumbnailUrl,
                thumbnailSize = mediaDto.thumbnailSize,
                mediumUrl = mediaDto.mediumUrl,
                mediumSize = mediaDto.mediumSize,
                createdAt = mediaDto.createdAt,
                translations = mediaDto.translations.map {
                    MediaTranslationResponse(
                        language = it.language,
                        title = it.title,
                    )
                }
            ).withFullUrls(storageProperties.cloudflare.r2.publicEndpoint)
        }

        return MediaListResponse(media = mediaDtoList)
    }

}
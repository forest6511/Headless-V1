package com.headblog.backend.infra.api.admin.media

import com.headblog.backend.app.usecase.media.command.create.CreateMediaCommand
import com.headblog.backend.app.usecase.media.command.create.CreateMediaUseCase
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.infra.api.admin.media.response.MediaResponse
import jakarta.servlet.http.HttpServletRequest
import java.time.LocalDateTime
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import kotlin.random.Random

@RestController
@RequestMapping("/api/admin/medias")
class MediaController(
    private val createMediaUseCase: CreateMediaUseCase
) {

    private val logger = LoggerFactory.getLogger(MediaController::class.java)

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun create(
        httpServletRequest: HttpServletRequest,
        @RequestParam("file") file: MultipartFile,
        @AuthenticationPrincipal user: User
    ): MediaResponse {
        val command = CreateMediaCommand(file, user)
        return createMediaUseCase.execute(command)
    }

    @GetMapping
    fun listMediaFiles(
        @RequestParam(required = false, defaultValue = "1") page: Int,
        @RequestParam(required = false, defaultValue = "20") limit: Int
    ): List<MediaResponse> {
        val startIndex = (page - 1) * limit
        // モックデータを生成
        return (0 until limit).map { i ->
            val index = startIndex + i + 1
            MediaResponse(
                id = UUID.randomUUID(),
                title = "サンプル画像$index",
                altText = "サンプル画像${index}の代替テキスト",
                uploadedBy = UUID.randomUUID(),
                thumbnailUrl = "https://placehold.jp/150x150.png?text=thumbnail$index",
                thumbnailSize = Random.nextLong(10_000, 50_000),
                smallUrl = "https://placehold.jp/150x150.png?text=small$index",
                smallSize = Random.nextLong(50_000, 200_000),
                mediumUrl = "https://placehold.jp/150x150.png?text=medium$index",
                mediumSize = Random.nextLong(200_000, 1_000_000),
                createdAt = LocalDateTime.now()
            )
        }
    }
}
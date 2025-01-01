package com.headblog.backend.infra.api.admin.media

import com.github.f4b6a3.uuid.UuidCreator
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
        @RequestParam(required = false) cursorMediaId: String?,
        @RequestParam(required = false, defaultValue = "20") pageSize: Int
    ): MediaListResponse {
        // すべてのデータを一度に生成せず、メモリに保持
        val allData = generateMockData()

        // カーソルの位置を特定
        val startIndex = if (cursorMediaId != null) {
            val index = allData.indexOfFirst { it.id == UUID.fromString(cursorMediaId) }
            if (index == -1) {
                // カーソルが見つからない場合は空のリストを返す
                return MediaListResponse(media = emptyList())
            }
            index + 1
        } else {
            0
        }

        // データの終端に達した場合は空のリストを返す
        if (startIndex >= allData.size) {
            return MediaListResponse(media = emptyList())
        }

        // 次のページ分のデータを取得
        val media = allData
            .drop(startIndex)
            .take(pageSize)

        return MediaListResponse(media = media)
    }

    // モックデータを生成するためのコンパニオンオブジェクト
    companion object {
        private val mockData: List<MediaResponse> by lazy {
            (1..205).map { index ->
                MediaResponse(
                    id = UuidCreator.getTimeOrdered(), // インデックスに基づいて時系列を作成
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
            }.sortedByDescending { it.id }
        }

        private fun generateMockData(): List<MediaResponse> = mockData
    }

    data class MediaListResponse(
        val media: List<MediaResponse>
    )
}
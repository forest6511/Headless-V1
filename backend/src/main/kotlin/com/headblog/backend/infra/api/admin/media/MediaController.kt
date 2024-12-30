package com.headblog.backend.infra.api.admin.media

import java.time.Instant
import java.util.*
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import kotlin.random.Random

@RestController
@RequestMapping("/api/admin/medias")
class MediaController {

    @GetMapping
    fun listMediaFiles(
        @RequestParam(required = false, defaultValue = "1") page: Int,
        @RequestParam(required = false, defaultValue = "20") limit: Int
    ): List<MediaFile> {
        val startIndex = (page - 1) * limit
        // モックデータを生成
        return (0 until limit).map { i ->
            val index = startIndex + i + 1
            MediaFile(
                id = UUID.randomUUID().toString(),
                filePath = "/uploads/sample$index.png",
                fileType = "image/png",
                originalSize = Random.nextLong(500_000, 5_500_000),
                title = "サンプル画像$index",
                altText = "サンプル画像${index}の代替テキスト",
                uploadedBy = "user-uuid",
                thumbnailUrl = "https://placehold.jp/150x150.png?text=thumbnail$index",
                thumbnailSize = Random.nextLong(10_000, 50_000),
                smallUrl = "https://placehold.jp/150x150.png?text=small$index",
                smallSize = Random.nextLong(50_000, 200_000),
                mediumUrl = "https://placehold.jp/150x150.png?text=medium$index",
                mediumSize = Random.nextLong(200_000, 1_000_000),
                uploadedAt = Instant.now().minusSeconds(Random.nextLong(0, 10_000_000))
            )
        }
    }
}

// データクラスの定義
data class MediaFile(
    val id: String,
    val filePath: String,
    val fileType: String,
    val originalSize: Long,
    val title: String,
    val altText: String,
    val uploadedBy: String,
    val thumbnailUrl: String,
    val thumbnailSize: Long,
    val smallUrl: String,
    val smallSize: Long,
    val mediumUrl: String,
    val mediumSize: Long,
    val uploadedAt: Instant
)
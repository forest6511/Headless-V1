package com.headblog.backend.infra.service.media

import com.headblog.backend.domain.model.media.ImageProcessor
import com.headblog.backend.shared.exceptions.AppConflictException
import java.io.InputStream
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import org.im4java.core.ConvertCmd
import org.im4java.core.IMOperation
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class ImageMagickProcessor : ImageProcessor {
    private val logger = LoggerFactory.getLogger(ImageMagickProcessor::class.java)
    private val convertCmd = ConvertCmd()

    override fun processImage(
        input: InputStream,
        width: Int,
        height: Int,
        format: String
    ): ByteArray {
        return processImageInternal(input, format) {
            resize(width, height, ">") // サイズ指定あり
        }
    }

    override fun processImageWithoutResize(
        input: InputStream,
        format: String
    ): ByteArray {
        return processImageInternal(input, format) {
            // サイズ指定なし。変換のみ
        }
    }

    private fun processImageInternal(
        input: InputStream,
        format: String,
        configureOperation: IMOperation.() -> Unit
    ): ByteArray {
        val tempDir = System.getProperty("java.io.tmpdir")
        val tempInput = Files.createTempFile(Paths.get(tempDir), "input", null)
        val tempOutput = Files.createTempFile(Paths.get(tempDir), "output", ".$format")

        logger.debug("Processing image: {} -> {}", tempInput, tempOutput)

        return try {
            input.use { Files.copy(it, tempInput, StandardCopyOption.REPLACE_EXISTING) }

            val operation = IMOperation().apply {
                addImage(tempInput.toString()) // 入力画像ファイルを指定
                autoOrient() // EXIFデータに基づいて画像の向きを自動調整
                strip() // メタデータを削除しファイルサイズを削減
                quality(82.0) // 出力画像の品質を70%に設定
                format(format) // 出力フォーマットを指定
                configureOperation() // カスタム設定（リサイズあり/なし）
                addImage(tempOutput.toString()) // 出力画像ファイルを指定
            }

            try {
                convertCmd.run(operation)
            } catch (e: Exception) {
                throw AppConflictException("画像の処理に失敗しました", e)
            }

            Files.readAllBytes(tempOutput)
        } finally {
            runCatching {
                Files.deleteIfExists(tempInput)
                Files.deleteIfExists(tempOutput)
            }
        }
    }
}

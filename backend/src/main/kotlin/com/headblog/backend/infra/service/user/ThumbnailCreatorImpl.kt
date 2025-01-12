package com.headblog.backend.infra.service.user

import com.headblog.backend.domain.model.user.Language
import com.headblog.backend.domain.model.user.ThumbnailGenerator
import com.headblog.backend.shared.exception.AppConflictException
import java.awt.Color
import java.awt.Font
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.nio.file.Files
import java.nio.file.Paths
import javax.imageio.ImageIO
import org.im4java.core.ConvertCmd
import org.im4java.core.IMOperation
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class ThumbnailCreatorImpl : ThumbnailGenerator {

    private val logger = LoggerFactory.getLogger(ThumbnailCreatorImpl::class.java)

    override fun generateThumbnailUrl(nickname: String, language: Language): ByteArray {
        // ニックネームの最初の1文字を取得
        val firstChar = nickname.firstOrNull()?.toString()
            ?: throw IllegalArgumentException("nickname is empty")

        // 言語に応じて適切なフォントを選択
        val font = getFont(language)

        // 文字を描画したBufferedImageを生成
        val image = createImageWithText(firstChar, font)

        // BufferedImageをWebP形式に変換
        val output = ByteArrayOutputStream()
        ImageIO.write(image, "webp", output)
        val imageBytes = output.toByteArray()

        // ImageMagickを使用して画像をリサイズ（100x100）
        val processedImageBytes = convertImageWithImageMagick(imageBytes, 100, 100, "webp")

        // 処理後のバイト配列を返却
        return processedImageBytes
    }

    // 言語に応じてフォントを選択
    private fun getFont(language: Language): Font {
        return if (language.value.lowercase() == "ja") {
            Font("Noto Sans CJK JP", Font.BOLD, 150)
        } else {
            Font("Arial", Font.BOLD, 150)
        }
    }

    // テキストを中央に描画したBufferedImageを生成
    private fun createImageWithText(text: String, font: Font): BufferedImage {
        val width = 200
        val height = 200
        val image = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
        val g2d: Graphics2D = image.createGraphics()

        // 背景を青、ピンク、緑からランダムに選択
        g2d.color = getPredefinedRandomColor()
        g2d.fillRect(0, 0, width, height)

        // テキストのスタイルを白に設定
        g2d.color = Color.WHITE
        g2d.font = font

        // テキストを中央に配置
        val metrics = g2d.fontMetrics
        val x = (width - metrics.stringWidth(text)) / 2
        val y = ((height - metrics.height) / 2) + metrics.ascent

        g2d.drawString(text, x, y)
        g2d.dispose()

        return image
    }

    // 青、ピンク、緑からランダムに背景色を選択
    private fun getPredefinedRandomColor(): Color {
        val colors = listOf(Color.BLUE, Color.PINK, Color.GREEN)
        return colors.random()
    }

    // ImageMagickを使用して画像をリサイズ
    private fun convertImageWithImageMagick(inputBytes: ByteArray, width: Int, height: Int, format: String): ByteArray {
        // 一時ディレクトリの取得
        val tempDir = System.getProperty("java.io.tmpdir")

        // 一時ファイルの作成
        val inputFile = Files.createTempFile(Paths.get(tempDir), "input", ".webp").toFile()
        val outputFile = Files.createTempFile(Paths.get(tempDir), "output", ".$format").toFile()

        return try {
            // 入力バイト配列を一時ファイルに書き込み
            inputFile.outputStream().use { it.write(inputBytes) }

            // ImageMagickのコマンド設定
            val cmd = ConvertCmd()
            val op = IMOperation()
            op.addImage(inputFile.absolutePath) // 入力ファイル
            op.resize(width, height)            // リサイズ
            op.addImage(outputFile.absolutePath) // 出力ファイル

            // コマンド実行
            cmd.run(op)

            // 出力ファイルからバイト配列を読み込む
            Files.readAllBytes(outputFile.toPath())
        } catch (e: Exception) {
            logger.error("ImageMagick processing failed: {}", e.message)
            throw AppConflictException("Failed to process image with ImageMagick", e)
        } finally {
            // 一時ファイルを削除
            if (inputFile.exists()) {
                if (!inputFile.delete()) {
                    logger.warn("Failed to delete temporary input file: {}", inputFile.absolutePath)
                }
            }
            if (outputFile.exists()) {
                if (!outputFile.delete()) {
                    logger.warn("Failed to delete temporary output file: {}", outputFile.absolutePath)
                }
            }
        }
    }
}

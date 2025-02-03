package com.headblog.backend.infra.service.user

import com.headblog.backend.domain.model.common.Language
import com.headblog.backend.domain.model.user.ThumbnailGenerator
import java.awt.Color
import java.awt.Font
import java.awt.RenderingHints
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class ThumbnailCreatorImpl : ThumbnailGenerator {

    private val logger = LoggerFactory.getLogger(ThumbnailCreatorImpl::class.java)

    private companion object {
        const val IMAGE_SIZE = 100
        const val DEFAULT_FONT_SIZE = 40
        val BACKGROUND_COLORS = listOf(
            Color(66, 133, 244),   // Blue
            Color(219, 68, 55),    // Red
            Color(244, 180, 0),    // Yellow
            Color(15, 157, 88)     // Green
        )
    }

    override fun generateThumbnailUrl(nickname: String, language: Language, extension: String): ByteArray {
        val firstChar = nickname.firstOrNull()?.toString()
            ?: throw IllegalArgumentException("ニックネームが空です")

        val image = BufferedImage(IMAGE_SIZE, IMAGE_SIZE, BufferedImage.TYPE_INT_ARGB)
        val g2d = image.createGraphics()

        try {
            // アンチエイリアス設定
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
            g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)

            // 背景を描画
            g2d.color = BACKGROUND_COLORS.random()
            g2d.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE)

            // フォント設定
            val font = getFont(language)
            g2d.font = font
            g2d.color = Color.WHITE

            // テキストを中央に配置
            val metrics = g2d.fontMetrics
            val x = (IMAGE_SIZE - metrics.stringWidth(firstChar)) / 2
            val y = ((IMAGE_SIZE - metrics.height) / 2) + metrics.ascent

            g2d.drawString(firstChar, x, y)
        } finally {
            g2d.dispose()
        }

        // PNGとしてエンコード
        return ByteArrayOutputStream().use { output ->
            ImageIO.write(image, extension, output)
            output.toByteArray()
        }
    }

    private fun getFont(language: Language): Font {
        val fontName = if (language.value == "ja") {
            "Noto Sans CJK JP"
        } else {
            "Arial"
        }

        return runCatching {
            Font(fontName, Font.BOLD, DEFAULT_FONT_SIZE)
        }.getOrElse {
            logger.warn("フォント {} の読み込みに失敗しました。デフォルトフォントを使用します", fontName)
            Font.decode(null).deriveFont(Font.BOLD, DEFAULT_FONT_SIZE.toFloat())
        }
    }
}
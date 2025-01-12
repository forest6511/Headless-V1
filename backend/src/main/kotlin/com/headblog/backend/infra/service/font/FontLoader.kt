package com.headblog.backend.infra.service.font

import jakarta.annotation.PostConstruct
import java.awt.Font
import java.awt.GraphicsEnvironment
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class FontLoader {

    private val logger = LoggerFactory.getLogger(FontLoader::class.java)

    @PostConstruct
    fun loadFonts() {
        val ge = GraphicsEnvironment.getLocalGraphicsEnvironment()

        val fontsToLoad = listOf(
            "fonts/NotoSansCJKjp-Regular.otf",
            "fonts/Arial.ttf"
        )

        fontsToLoad.forEach { fontPath ->
            val fontStream = this::class.java.classLoader.getResourceAsStream(fontPath)
            if (fontStream == null) {
                logger.warn("Font file not found: {}", fontPath)
                return@forEach
            }

            fontStream.use {
                try {
                    val font = Font.createFont(Font.TRUETYPE_FONT, it)
                    ge.registerFont(font)
                    logger.info("Successfully loaded font: {}", font.name)
                } catch (e: Exception) {
                    logger.error("Failed to load font from {}: {}", fontPath, e.message)
                }
            }
        }

        if (!isFontLoaded("Noto Sans CJK JP")) {
            logger.error("Critical font 'Noto Sans CJK JP' failed to load. Application cannot proceed.")
            throw RuntimeException("Essential font 'Noto Sans CJK JP' is missing.")
        }

        if (!isFontLoaded("Arial")) {
            logger.warn("Optional font 'Arial' failed to load. Falling back to default sans-serif font.")
        }
    }

    private fun isFontLoaded(fontName: String): Boolean {
        val ge = GraphicsEnvironment.getLocalGraphicsEnvironment()
        return ge.availableFontFamilyNames.contains(fontName)
    }
}
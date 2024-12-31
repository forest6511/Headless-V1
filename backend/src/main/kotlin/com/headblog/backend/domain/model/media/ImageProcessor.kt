package com.headblog.backend.domain.model.media

import java.io.InputStream

interface ImageProcessor {
    fun processImage(
        input: InputStream,
        width: Int,
        height: Int,
        format: String = "webp"
    ): ByteArray

    fun processImageWithoutResize(
        input: InputStream,
        format: String = "webp"
    ): ByteArray
}
package com.headblog.backend.infra.config

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class StoragePropertiesTest {

    @Autowired
    private lateinit var storageProperties: StorageProperties

    @Test
    @DisplayName("R2ストレージの設定が正しく読み込まれること")
    fun `should load R2 storage configuration correctly`() {
        val r2Props = storageProperties.cloudflare.r2
        assertEquals(r2Props.bucketName, "test-bucket")
        assertEquals(r2Props.accessKey, "test-access-key")
        assertEquals(r2Props.secretKey, "test-secret-key")
        assertEquals(r2Props.endpoint, "https://test-account.r2.cloudflarestorage.com")
    }

    @Test
    @DisplayName("メディアの基本設定が正しく読み込まれること")
    fun `should load media basic configuration correctly`() {
        val mediaProps = storageProperties.media
        val expectedTypes = listOf("image/jpeg", "image/png", "image/gif", "image/webp", "image/heic").sorted()

        assertEquals(mediaProps.maxFileSize, "20MB")
        assertEquals(mediaProps.supportedTypes.sorted(), expectedTypes)
    }

    @Test
    @DisplayName("画像サイズの設定が正しく読み込まれること")
    fun `should load image size configuration correctly`() {
        val sizes = storageProperties.media.sizes

        with(sizes.thumbnail) {
            assertEquals(width, 100)
            assertEquals(height, 100)
        }
        with(sizes.small) {
            assertEquals(width, 300)
            assertEquals(height, 300)
        }
        with(sizes.medium) {
            assertEquals(width, 800)
            assertEquals(height, 800)
        }
    }
}
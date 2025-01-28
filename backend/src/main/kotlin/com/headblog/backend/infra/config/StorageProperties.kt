package com.headblog.backend.infra.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "storage")
data class StorageProperties(
    val cloudflare: CloudflareProperties,
    val media: MediaProperties
) {
    data class CloudflareProperties(
        val r2: R2Properties
    ) {
        data class R2Properties(
            val bucketName: String,
            val accessKey: String,
            val secretKey: String,
            val endpoint: String,
            val publicEndpoint: String,
        )
    }

    data class MediaProperties(
        val maxFileSize: String,
        val supportedTypes: Set<String>,
        val sizes: ImageSizes
    ) {
        data class ImageSizes(
            val thumbnail: ImageSize,
            val medium: ImageSize
        ) {
            data class ImageSize(
                val width: Int,
                val height: Int
            )
        }
    }
}
package com.headblog.backend.infra.service.media

import java.net.URI
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client

@Configuration
@EnableConfigurationProperties(StorageProperties::class)
class StorageConfig {
    @Bean
    fun s3Client(properties: StorageProperties): S3Client {
        val credentials = AwsBasicCredentials.create(
            properties.cloudflare.r2.accessKey,
            properties.cloudflare.r2.secretKey
        )

        return S3Client.builder()
            .endpointOverride(URI(properties.cloudflare.r2.endpoint))
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            // R2で設定済みのRegion
            .region(Region.US_EAST_1)
            .build()
    }
}
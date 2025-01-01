package com.headblog.backend.infra.config

import io.mockk.mockk
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import software.amazon.awssdk.services.s3.S3Client

@TestConfiguration
class StorageTestConfig {
    @Bean
    fun s3Client(): S3Client = mockk<S3Client>()
}
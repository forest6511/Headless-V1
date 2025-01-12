package com.headblog.backend.infra.service.media

import com.headblog.backend.domain.model.media.StorageService
import com.headblog.backend.infra.config.StorageProperties
import com.headblog.backend.shared.exceptions.AppConflictException
import org.springframework.stereotype.Service
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest

@Service
class CloudflareR2Service(
    private val s3Client: S3Client,
    private val storageProperties: StorageProperties
) : StorageService {

    override fun uploadFile(key: String, data: ByteArray, contentType: String): String {
        val putObjectRequest = PutObjectRequest.builder()
            .bucket(storageProperties.cloudflare.r2.bucketName)
            .key(key)
            .contentType(contentType)
            .build()

        val requestBody = RequestBody.fromBytes(data)

        return try {
            s3Client.putObject(putObjectRequest, requestBody)
            "${storageProperties.cloudflare.r2.endpoint}/${key}"
        } catch (e: Exception) {
            throw AppConflictException("ファイルのアップロードに失敗しました", e)
        }
    }

    override fun deleteFile(key: String) {
        val deleteObjectRequest = DeleteObjectRequest.builder()
            .bucket(storageProperties.cloudflare.r2.bucketName)
            .key(key)
            .build()

        try {
            s3Client.deleteObject(deleteObjectRequest)
        } catch (e: Exception) {
            throw AppConflictException("ファイルの削除に失敗しました", e)
        }
    }
}
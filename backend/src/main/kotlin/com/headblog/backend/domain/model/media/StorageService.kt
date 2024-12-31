package com.headblog.backend.domain.model.media

interface StorageService {
    fun uploadFile(key: String, data: ByteArray, contentType: String): String
    fun deleteFile(key: String)
}
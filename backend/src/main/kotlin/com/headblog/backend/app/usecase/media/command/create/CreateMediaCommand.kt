package com.headblog.backend.app.usecase.media.command.create

import com.headblog.backend.domain.model.user.User
import org.springframework.web.multipart.MultipartFile

data class CreateMediaCommand(
    val file: MultipartFile,
    val user: User,
    val language: String,
    val title: String,
)
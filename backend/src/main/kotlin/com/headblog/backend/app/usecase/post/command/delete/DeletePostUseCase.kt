package com.headblog.backend.app.usecase.post.command.delete

import com.headblog.backend.domain.model.post.PostId
import java.util.*

interface DeletePostUseCase {
    fun execute(deleteId: UUID): PostId
}
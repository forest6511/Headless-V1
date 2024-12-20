package com.headblog.backend.app.usecase.post.command.update

import com.headblog.backend.domain.model.post.PostId

interface UpdatePostUseCase {
    fun execute(command: UpdatePostCommand): PostId
}
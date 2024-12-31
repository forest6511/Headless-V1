package com.headblog.backend.app.usecase.media.command.create

import com.headblog.backend.infra.api.admin.media.response.MediaResponse

interface CreateMediaUseCase {
    fun execute(command: CreateMediaCommand): MediaResponse
}
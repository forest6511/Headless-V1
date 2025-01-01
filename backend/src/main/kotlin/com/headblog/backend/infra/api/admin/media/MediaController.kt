package com.headblog.backend.infra.api.admin.media

import com.headblog.backend.app.usecase.media.command.create.CreateMediaCommand
import com.headblog.backend.app.usecase.media.command.create.CreateMediaUseCase
import com.headblog.backend.app.usecase.media.query.GetMediaService
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.infra.api.admin.media.response.MediaListResponse
import com.headblog.backend.infra.api.admin.media.response.MediaResponse
import jakarta.servlet.http.HttpServletRequest
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/admin/medias")
class MediaController(
    private val createMediaUseCase: CreateMediaUseCase,
    private val getMediaService: GetMediaService,
) {

    private val logger = LoggerFactory.getLogger(MediaController::class.java)

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun create(
        httpServletRequest: HttpServletRequest,
        @RequestParam("file") file: MultipartFile,
        @AuthenticationPrincipal user: User
    ): MediaResponse {
        val command = CreateMediaCommand(file, user)
        return createMediaUseCase.execute(command)
    }

    @GetMapping
    fun listMediaFiles(
        @RequestParam(required = false) mediaId: UUID?,
        @RequestParam(required = false) userId: UUID?,
        @RequestParam(required = false, defaultValue = "20") pageSize: Int
    ): MediaListResponse {
        return getMediaService.findMediaList(mediaId, userId, pageSize)
    }
}
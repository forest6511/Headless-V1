package com.headblog.backend.app.usecase.media.command.create

import com.headblog.backend.app.usecase.translation.TranslationService
import com.headblog.backend.domain.model.common.Language
import com.headblog.backend.domain.model.media.ImageProcessor
import com.headblog.backend.domain.model.media.Media
import com.headblog.backend.domain.model.media.MediaId
import com.headblog.backend.domain.model.media.MediaRepository
import com.headblog.backend.domain.model.media.MediaSize
import com.headblog.backend.domain.model.media.MediaTranslation
import com.headblog.backend.domain.model.media.StorageService
import com.headblog.backend.infra.api.admin.media.response.MediaResponse
import com.headblog.backend.infra.api.admin.media.response.MediaTranslationResponse
import com.headblog.backend.infra.config.StorageProperties
import com.headblog.backend.shared.constants.LanguageConstants
import com.headblog.backend.shared.exceptions.AppConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.io.ByteArrayInputStream
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile

@Service
@Transactional
class CreateMediaService(
    private val idGenerator: IdGenerator<EntityId>,
    private val mediaRepository: MediaRepository,
    private val imageProcessor: ImageProcessor,
    private val storageService: StorageService,
    private val storageProperties: StorageProperties,
    private val translationService: TranslationService
) : CreateMediaUseCase {

    private val logger = LoggerFactory.getLogger(CreateMediaService::class.java)

    private val convertFormat = "webp"
    private val uploadFormat = "image/webp"

    override fun execute(command: CreateMediaCommand): MediaResponse {
        val file: MultipartFile = command.file
        val fileBytes = file.inputStream.use { it.readAllBytes() }

        if (toBytes(storageProperties.media.maxFileSize) < fileBytes.size.toLong()) {
            throw AppConflictException("ファイルサイズが許容範囲を超えています。 ${storageProperties.media.maxFileSize}")
        }

        val mediaId = MediaId(idGenerator.generate().value)

        val fileName = file.originalFilename?.substringAfterLast("/")?.let { convertToWebpFileName(it) }
            ?: throw AppConflictException("オリジナルファイルが取得できませんでした。")

        val sizes = listOf(
            ImageSizeConfig(
                "t",
                storageProperties.media.sizes.thumbnail.width,
                storageProperties.media.sizes.thumbnail.height,
                storageProperties.media.sizes.thumbnail.quality
            ),
            ImageSizeConfig(
                "s",
                storageProperties.media.sizes.small.width,
                storageProperties.media.sizes.small.height,
                storageProperties.media.sizes.small.quality
            ),
            ImageSizeConfig(
                "l",
                storageProperties.media.sizes.large.width,
                storageProperties.media.sizes.large.height,
                storageProperties.media.sizes.large.quality
            ),
        )
        val mediaSizes = sizes.map { sizeConfig ->
            processAndUploadImage(fileBytes, mediaId, sizeConfig, fileName)
        }

        val translations = translateTitle(command.language, command.title)

        val media = Media.createWithId(
            id = mediaId,
            uploadedBy = command.user.id,
            thumbnail = mediaSizes[0],
            small = mediaSizes[1],
            large = mediaSizes[2],
            translations = translations
        )

        mediaRepository.save(media)

        return MediaResponse(
            id = media.id.value,
            uploadedBy = media.uploadedBy.value,
            thumbnailUrl = media.thumbnail.url,
            thumbnailSize = media.thumbnail.size,
            smallUrl = media.small.url,
            smallSize = media.small.size,
            largeUrl = media.large.url,
            largeSize = media.large.size,
            createdAt = LocalDateTime.now(),
            translations = translations.map {
                MediaTranslationResponse(
                    language = it.language.value,
                    title = it.title,
                )
            }
        )
    }

    private fun convertToWebpFileName(originalFileName: String): String {
        val extensionIndex = originalFileName.lastIndexOf(".")
        return if (extensionIndex != -1) {
            originalFileName.substring(0, extensionIndex) + ".$convertFormat"
        } else {
            "$originalFileName.$convertFormat"
        }
    }

    private fun processAndUploadImage(
        fileBytes: ByteArray,
        mediaId: MediaId,
        sizeConfig: ImageSizeConfig,
        fileName: String
    ): MediaSize {
        val processedImage = if (
            sizeConfig.width != null &&
            sizeConfig.height != null &&
            sizeConfig.quality != null
        ) {
            imageProcessor.processImage(
                ByteArrayInputStream(fileBytes),
                sizeConfig.width,
                sizeConfig.height,
                sizeConfig.quality,
                format = convertFormat
            )
        } else {
            imageProcessor.processImageWithoutResize(
                ByteArrayInputStream(fileBytes),
                format = convertFormat
            )
        }

        val yearMonth = getCurrentYearMonth()
        val key = "media/$yearMonth/${mediaId.value}-${sizeConfig.prefix}-$fileName"
        storageService.uploadFile(key, processedImage, uploadFormat)
        return MediaSize(key, processedImage.size)
    }

    private fun toBytes(size: String): Long {
        val units = mapOf(
            "KB" to 1024L,
            "MB" to 1024L * 1024,
            "GB" to 1024L * 1024 * 1024,
            "K" to 1024L,
            "M" to 1024L * 1024,
            "G" to 1024L * 1024 * 1024
        )

        val cleanSize = size.trim().uppercase()

        return units.entries.find { cleanSize.endsWith(it.key) }?.let {
            cleanSize.removeSuffix(it.key).toLong() * it.value
        } ?: cleanSize.toLong()
    }

    data class ImageSizeConfig(
        val prefix: String,
        val width: Int?,
        val height: Int?,
        val quality: Int?
    )

    fun getCurrentYearMonth(): String {
        val currentDate = LocalDate.now()
        val formatter = DateTimeFormatter.ofPattern("yyyyMM")
        return currentDate.format(formatter)
    }


    private fun translateTitle(language: String, title: String): List<MediaTranslation> {
        val (sourceLang, targetLang) = when (language) {
            LanguageConstants.JA -> LanguageConstants.JA to LanguageConstants.EN
            LanguageConstants.EN -> LanguageConstants.EN to LanguageConstants.JA
            else -> throw AppConflictException("Unsupported language: $language")
        }

        // 翻訳の生成
        val translatedTile = translate {
            translationService.translateTitle(title, targetLang)
        }

        return listOf(
            MediaTranslation(
                language = Language.of(sourceLang),
                title = title,
            ),
            MediaTranslation(
                language = Language.of(targetLang),
                title = translatedTile,
            )
        )
    }

    private fun translate(block: () -> Result<String>): String {
        return block().getOrElse {
            logger.error("MediaTranslation failed", it)
            throw AppConflictException("MediaTranslation failed")
        }
    }
}

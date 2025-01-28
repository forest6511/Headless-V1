package com.headblog.backend.infra.repository.media

import com.headblog.backend.app.usecase.media.query.MediaDto
import com.headblog.backend.app.usecase.media.query.TranslationDto
import com.headblog.backend.domain.model.media.Media
import com.headblog.backend.domain.model.media.MediaId
import com.headblog.backend.domain.model.media.MediaRepository
import com.headblog.backend.domain.model.user.UserId
import com.headblog.infra.jooq.tables.references.MEDIAS
import com.headblog.infra.jooq.tables.references.MEDIA_TRANSLATIONS
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class MediaRepositoryImpl(
    private val dsl: DSLContext
) : MediaRepository {

    override fun save(media: Media): Int {
        val mediaResult = dsl.insertInto(MEDIAS)
            .set(MEDIAS.ID, media.id.value)
            .set(MEDIAS.UPLOADED_BY, media.uploadedBy.value)
            .set(MEDIAS.THUMBNAIL_URL, media.thumbnail.url)
            .set(MEDIAS.THUMBNAIL_SIZE, media.thumbnail.size)
            .set(MEDIAS.MEDIUM_URL, media.medium.url)
            .set(MEDIAS.MEDIUM_SIZE, media.medium.size)
            .execute()

        media.translations.forEach { translation ->
            dsl.insertInto(MEDIA_TRANSLATIONS)
                .set(MEDIA_TRANSLATIONS.MEDIA_ID, media.id.value)  // この行を追加
                .set(MEDIA_TRANSLATIONS.LANGUAGE, translation.language.value)
                .set(MEDIA_TRANSLATIONS.TITLE, translation.title)
                .execute()
        }

        return mediaResult
    }

    override fun update(media: Media): Int {
        val mediaResult = dsl.update(MEDIAS)
            .set(MEDIAS.THUMBNAIL_URL, media.thumbnail.url)
            .set(MEDIAS.THUMBNAIL_SIZE, media.thumbnail.size)
            .set(MEDIAS.MEDIUM_URL, media.medium.url)
            .set(MEDIAS.MEDIUM_SIZE, media.medium.size)
            .where(MEDIAS.ID.eq(media.id.value))
            .execute()

        // delete/insert 既存の翻訳を削除（選択された言語のみ）
        dsl.deleteFrom(MEDIA_TRANSLATIONS)
            .where(
                MEDIA_TRANSLATIONS.MEDIA_ID.eq(media.id.value)
                    .and(MEDIA_TRANSLATIONS.LANGUAGE.eq(media.translations.first().language.value))
            )
            .execute()

        media.translations.forEach { translation ->
            dsl.insertInto(MEDIA_TRANSLATIONS)
                .set(MEDIA_TRANSLATIONS.MEDIA_ID, media.id.value)
                .set(MEDIA_TRANSLATIONS.LANGUAGE, translation.language.value)
                .set(MEDIA_TRANSLATIONS.TITLE, translation.title)
                .execute()
        }

        return mediaResult
    }

    override fun delete(media: Media): Int {
        return dsl.deleteFrom(MEDIAS)
            .where(MEDIAS.ID.eq(media.id.value))
            .execute()
    }

    override fun findAll(
        cursorMediaId: MediaId?,
        uploadedBy: UserId?,
        pageSize: Int,
    ): List<MediaDto> {
        // 1. 必要なメディアIDを取得（ページネーション用）
        val mediaIds = dsl.select(MEDIAS.ID)
            .from(MEDIAS)
            .apply {
                cursorMediaId?.let { id ->
                    where(MEDIAS.ID.lessThan(id.value))
                }
                uploadedBy?.let { userId ->
                    where(MEDIAS.UPLOADED_BY.eq(userId.value))
                }
            }
            .orderBy(MEDIAS.ID.desc())
            .limit(pageSize + 1)
            .fetch(MEDIAS.ID)

        if (mediaIds.isEmpty()) {
            return emptyList()
        }

        // 2. メディアと翻訳を一度に取得
        return dsl.select()
            .from(MEDIAS)
            .leftJoin(MEDIA_TRANSLATIONS)
            .on(MEDIAS.ID.eq(MEDIA_TRANSLATIONS.MEDIA_ID))
            .where(MEDIAS.ID.`in`(mediaIds))
            .orderBy(MEDIAS.ID.desc())
            .fetch()
            .groupBy { it.get(MEDIAS.ID) }
            .map { (_, records) -> records.toMediaDto() }
    }


    override fun count(uploadedBy: UserId?): Int {
        val query = dsl.selectCount()
            .from(MEDIAS)
        uploadedBy?.let { userId ->
            query.where(MEDIAS.UPLOADED_BY.eq(userId.value))
        }
        return query.fetchOne(0, Int::class.java) ?: 0
    }

    private fun List<Record>.toMediaDto(): MediaDto {
        val firstRecord = first()
        return MediaDto(
            id = checkNotNull(firstRecord.get(MEDIAS.ID)),
            title = checkNotNull(firstRecord.get(MEDIA_TRANSLATIONS.TITLE)),
            uploadedBy = checkNotNull(firstRecord.get(MEDIAS.UPLOADED_BY)),
            thumbnailUrl = checkNotNull(firstRecord.get(MEDIAS.THUMBNAIL_URL)),
            thumbnailSize = checkNotNull(firstRecord.get(MEDIAS.THUMBNAIL_SIZE)),
            mediumUrl = checkNotNull(firstRecord.get(MEDIAS.MEDIUM_URL)),
            mediumSize = checkNotNull(firstRecord.get(MEDIAS.MEDIUM_SIZE)),
            createdAt = checkNotNull(firstRecord.get(MEDIAS.CREATED_AT)),
            translations = map { record ->
                TranslationDto(
                    language = checkNotNull(record.get(MEDIA_TRANSLATIONS.LANGUAGE)),
                    title = checkNotNull(record.get(MEDIA_TRANSLATIONS.TITLE))
                )
            }
        )
    }
}
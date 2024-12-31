package com.headblog.backend.infra.repository.media

import com.headblog.backend.app.usecase.media.query.MediaDto
import com.headblog.backend.domain.model.media.Media
import com.headblog.backend.domain.model.media.MediaId
import com.headblog.backend.domain.model.media.MediaRepository
import com.headblog.backend.domain.model.user.UserId
import com.headblog.infra.jooq.tables.references.MEDIAS
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class MediaRepositoryImpl(
    private val dsl: DSLContext
) : MediaRepository {

    override fun save(media: Media): Int {
        return dsl.insertInto(MEDIAS)
            .set(MEDIAS.ID, media.id.value)
            .set(MEDIAS.TITLE, media.title)
            .set(MEDIAS.ALT_TEXT, media.altText)
            .set(MEDIAS.UPLOADED_BY, media.uploadedBy.value)
            .set(MEDIAS.THUMBNAIL_URL, media.thumbnail.url)
            .set(MEDIAS.THUMBNAIL_SIZE, media.thumbnail.size)
            .set(MEDIAS.SMALL_URL, media.small.url)
            .set(MEDIAS.SMALL_SIZE, media.small.size)
            .set(MEDIAS.MEDIUM_URL, media.medium.url)
            .set(MEDIAS.MEDIUM_SIZE, media.medium.size)
            .execute()
    }

    override fun update(media: Media): Int {
        return dsl.update(MEDIAS)
            .set(MEDIAS.TITLE, media.title)
            .set(MEDIAS.ALT_TEXT, media.altText)
            .set(MEDIAS.THUMBNAIL_URL, media.thumbnail.url)
            .set(MEDIAS.THUMBNAIL_SIZE, media.thumbnail.size)
            .set(MEDIAS.SMALL_URL, media.small.url)
            .set(MEDIAS.SMALL_SIZE, media.small.size)
            .set(MEDIAS.MEDIUM_URL, media.medium.url)
            .set(MEDIAS.MEDIUM_SIZE, media.medium.size)
            .where(MEDIAS.ID.eq(media.id.value))
            .execute()
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
        val query = dsl.selectFrom(MEDIAS)

        // カーソル条件がある場合 (2ページ目以降)
        cursorMediaId?.let { id ->
            query.where(MEDIAS.ID.lessThan(id.value))
        }

        // アップロードユーザーの指定がある場合
        uploadedBy?.let { userId ->
            query.where(MEDIAS.UPLOADED_BY.eq(userId.value))
        }

        return query
            .orderBy(MEDIAS.ID.desc())
            .limit(pageSize + 1)
            .fetch()
            .map { it.toMediaDto() }
    }

    override fun count(uploadedBy: UserId?): Int {
        val query = dsl.selectCount()
            .from(MEDIAS)
        uploadedBy?.let { userId ->
            query.where(MEDIAS.UPLOADED_BY.eq(userId.value))
        }
        return query.fetchOne(0, Int::class.java) ?: 0
    }

    private fun Record.toMediaDto(): MediaDto {
        return MediaDto(
            id = get(MEDIAS.ID)!!,
            title = get(MEDIAS.TITLE),
            altText = get(MEDIAS.ALT_TEXT),
            uploadedBy = get(MEDIAS.UPLOADED_BY)!!,
            thumbnailUrl = get(MEDIAS.THUMBNAIL_URL)!!,
            thumbnailSize = get(MEDIAS.THUMBNAIL_SIZE)!!,
            smallUrl = get(MEDIAS.SMALL_URL)!!,
            smallSize = get(MEDIAS.SMALL_SIZE)!!,
            mediumUrl = get(MEDIAS.MEDIUM_URL)!!,
            mediumSize = get(MEDIAS.MEDIUM_SIZE)!!,
            createdAt = get(MEDIAS.CREATED_AT)!!
        )
    }
}
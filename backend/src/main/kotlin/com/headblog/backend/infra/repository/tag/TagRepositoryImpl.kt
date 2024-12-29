package com.headblog.backend.infra.repository.tag

import com.headblog.backend.app.usecase.tag.query.TagDto
import com.headblog.backend.domain.model.tag.Tag
import com.headblog.backend.domain.model.tag.TagId
import com.headblog.backend.domain.model.tag.TagRepository
import com.headblog.infra.jooq.tables.references.TAGS
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class TagRepositoryImpl(
    private val dsl: DSLContext
) : TagRepository {

    override fun save(tag: Tag): Int {
        return dsl.insertInto(TAGS)
            .set(TAGS.ID, tag.id.value)
            .set(TAGS.NAME, tag.name)
            .set(TAGS.SLUG, tag.slug)
            .execute()
    }

    override fun update(tag: Tag): Int {
        return dsl.update(TAGS)
            .set(TAGS.NAME, tag.name)
            .set(TAGS.SLUG, tag.slug)
            .where(TAGS.ID.eq(tag.id.value))
            .execute()
    }

    override fun delete(tagId: TagId): Int {
        return dsl.deleteFrom(TAGS)
            .where(TAGS.ID.eq(tagId.value))
            .execute()
    }

    override fun findById(id: UUID): TagDto? {
        return dsl.select()
            .from(TAGS)
            .where(TAGS.ID.eq(id))
            .fetchOne()
            ?.toTagDto()
    }

    override fun findByName(name: String): TagDto? {
        return dsl.select()
            .from(TAGS)
            .where(TAGS.NAME.eq(name))
            .fetchOne()
            ?.toTagDto()
    }

    private fun Record.toTagDto(): TagDto {
        return TagDto(
            id = get(TAGS.ID)!!,
            name = get(TAGS.NAME)!!,
            slug = get(TAGS.SLUG)!!
        )
    }
}

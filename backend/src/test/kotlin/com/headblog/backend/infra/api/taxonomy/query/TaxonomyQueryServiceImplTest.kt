package com.headblog.backend.infra.api.taxonomy.query

import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyWithPostRefsDto
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import com.headblog.infra.jooq.tables.references.POST_TAXONOMIES
import com.headblog.infra.jooq.tables.references.TAXONOMIES
import io.mockk.every
import io.mockk.mockk
import java.time.LocalDateTime
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.RecordMapper
import org.jooq.Result
import org.jooq.SelectConditionStep
import org.jooq.impl.DSL.multiset
import org.jooq.impl.DSL.select
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test


class TaxonomyQueryServiceImplTest {

    private val dsl: DSLContext = mockk()
    private val service = TaxonomyQueryServiceImpl(dsl)

    @Test
    @DisplayName("タクソノミーを返す")
    fun `findById returns taxonomy`() {
        val id = TaxonomyId(UUID.randomUUID())
        val record: Record = mockk()
        every { dsl.select().from(TAXONOMIES).where(TAXONOMIES.ID.eq(id.value)).fetchOne() } returns record
        every { record[TAXONOMIES.ID] } returns id.value
        every { record[TAXONOMIES.NAME] } returns "Test"
        every { record[TAXONOMIES.TAXONOMY_TYPE] } returns "CATEGORY"
        every { record[TAXONOMIES.SLUG] } returns "test"
        every { record[TAXONOMIES.DESCRIPTION] } returns null
        every { record[TAXONOMIES.PARENT_ID] } returns null
        every { record[TAXONOMIES.CREATED_AT] } returns LocalDateTime.now()

        val result = service.findById(id)

        assertNotNull(result)
        assertEquals(id, result?.id)
        assertEquals("Test", result?.name)
    }

    @Test
    @DisplayName("タクソノミーのスラッグを返す - 複数件")
    fun `findBySlug returns taxonomies`() {
        val slug = "test-slug"
        val resultSet: Result<Record> = mockk()
        val records = listOf(mockk<Record>(), mockk<Record>())

        records.forEachIndexed { index, record ->
            every { record[TAXONOMIES.ID] } returns UUID.randomUUID()
            every { record[TAXONOMIES.NAME] } returns "Test ${index + 1}"
            every { record[TAXONOMIES.TAXONOMY_TYPE] } returns if (index == 0) "CATEGORY" else "TAG"
            every { record[TAXONOMIES.SLUG] } returns slug
            every { record[TAXONOMIES.DESCRIPTION] } returns if (index == 0) null else "Test description"
            every { record[TAXONOMIES.PARENT_ID] } returns null
            every { record[TAXONOMIES.CREATED_AT] } returns LocalDateTime.now()
        }

        every { dsl.select().from(TAXONOMIES).where(TAXONOMIES.SLUG.eq(slug)).fetch() } returns resultSet
        every {
            resultSet.map(match<RecordMapper<Record, TaxonomyDto>> { true })
        } returns listOf(
            TaxonomyDto(
                id = TaxonomyId(UUID.randomUUID()),
                name = "Test 1",
                taxonomyType = TaxonomyType.CATEGORY,
                slug = "test-slug",
                description = null,
                parentId = null,
                createdAt = LocalDateTime.now()
            ),
            TaxonomyDto(
                id = TaxonomyId(UUID.randomUUID()),
                name = "Test 2",
                taxonomyType = TaxonomyType.KEYWORD,
                slug = "test-slug",
                description = "Test description",
                parentId = null,
                createdAt = LocalDateTime.now()
            )
        )

        val result = service.findBySlug(slug)

        assertEquals(2, result.size)
        assertEquals("Test 1", result[0].name)
        assertEquals("Test 2", result[1].name)
        assertTrue(result.all { it.slug == slug })
    }

    @Test
    @DisplayName("指定されたタクソノミータイプに対応するタクソノミーを返す")
    fun `findByType returns taxonomies`() {
        val type = TaxonomyType.CATEGORY
        val taxonomyId = UUID.randomUUID()
        val resultSet: Result<Record> = mockk()
        val record: Record = mockk()

        // レコードのモック設定
        every { record[TAXONOMIES.ID] } returns taxonomyId
        every { record[TAXONOMIES.NAME] } returns "Test"
        every { record[TAXONOMIES.TAXONOMY_TYPE] } returns "CATEGORY"
        every { record[TAXONOMIES.SLUG] } returns "test"
        every { record[TAXONOMIES.DESCRIPTION] } returns null
        every { record[TAXONOMIES.PARENT_ID] } returns null
        every { record[TAXONOMIES.CREATED_AT] } returns LocalDateTime.now()

        every { dsl.select().from(TAXONOMIES).where(TAXONOMIES.TAXONOMY_TYPE.eq(type.name)).fetch() } returns resultSet
        every { resultSet.map<TaxonomyDto>(any()) } returns listOf(
            TaxonomyDto(
                id = TaxonomyId(taxonomyId),
                name = "Test",
                taxonomyType = TaxonomyType.CATEGORY,
                slug = "test",
                description = null,
                parentId = null,
                createdAt = LocalDateTime.now()
            )
        )

        val result = service.findByType(type)

        assertFalse(result.isEmpty())
        assertEquals("Test", result[0].name)
        assertEquals(taxonomyId, result[0].id.value)
    }

    @Test
    @DisplayName("タクソノミーに関連するタクシノミーとポストIDを返す")
    fun `findTypeWithPostRefs returns taxonomies with post references`() {
        val type = TaxonomyType.CATEGORY
        val taxonomyId = TaxonomyId(UUID.randomUUID())
        val postId1 = UUID.randomUUID()
        val postId2 = UUID.randomUUID()
        val resultSet: Result<Record> = mockk()
        val selectConditionStep: SelectConditionStep<Record> = mockk()

        every {
            dsl.select(
                TAXONOMIES.asterisk(),
                multiset(
                    select(POST_TAXONOMIES.POST_ID)
                        .from(POST_TAXONOMIES)
                        .where(POST_TAXONOMIES.TAXONOMY_ID.eq(TAXONOMIES.ID))
                ).`as`(POST_TAXONOMIES.POST_ID.name)
            ).from(TAXONOMIES)
                .where(TAXONOMIES.TAXONOMY_TYPE.eq(type.name))
        } returns selectConditionStep

        every { selectConditionStep.fetch() } returns resultSet
        every { resultSet.map(any<RecordMapper<Record, TaxonomyWithPostRefsDto>>()) } returns listOf(
            TaxonomyWithPostRefsDto(
                id = taxonomyId,
                name = "Test Taxonomy",
                taxonomyType = type,
                slug = "test-taxonomy",
                description = "Description",
                parentId = null,
                createdAt = LocalDateTime.now(),
                postIds = listOf(PostId(postId1), PostId(postId2))
            )
        )

        val result = service.findTypeWithPostRefs(type)

        assertTrue(result.isNotEmpty())
        assertEquals(2, result[0].postIds.size)
    }
}
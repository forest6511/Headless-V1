package com.headblog.backend.app.usecase.taxonomy.command.update

import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.domain.model.taxonomy.*
import com.headblog.backend.shared.exception.AppConflictException
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.*

class DeleteTaxonomyServiceTest {

    private val taxonomyRepository: TaxonomyRepository = mockk()
    private val updateTaxonomyService = UpdateTaxonomyService(taxonomyRepository)

    @Test
    @DisplayName("正常にタクソノミーが更新されること")
    fun `should update taxonomy successfully`() {
        // GIVEN: 既存のタクソノミーが存在し、スラッグがユニークである
        val taxonomyId = UUID.randomUUID()
        val existingDto = TaxonomyDto(
            id = taxonomyId,
            name = "Existing Taxonomy",
            slug = "existing-slug",
            description = "Existing description",
            parentId = UUID.randomUUID(),
            createdAt = LocalDateTime.now()
        )

        val command = UpdateTaxonomyCommand(
            id = taxonomyId,
            name = "Updated Taxonomy",
            slug = "updated-slug",
            description = "Updated description",
            parentId = null
        )

        every { taxonomyRepository.findById(taxonomyId) } returns existingDto
        every { taxonomyRepository.findBySlug("updated-slug") } returns null
        every { taxonomyRepository.update(any()) } returns 1

        // WHEN: タクソノミー更新を実行
        val result = updateTaxonomyService.execute(command)

        // THEN: 更新処理が成功し、リポジトリが更新メソッドを呼び出す
        assertEquals(CategoryId(taxonomyId), result)
        verify { taxonomyRepository.update(any()) }
    }

    @Test
    @DisplayName("タクソノミーが存在しない場合に例外をスローすること")
    fun `should throw exception when taxonomy not found`() {
        // GIVEN: 指定されたIDのタクソノミーが存在しない
        val taxonomyId = UUID.randomUUID()

        val command = UpdateTaxonomyCommand(
            id = taxonomyId,
            name = "Updated Taxonomy",
            slug = "updated-slug",
            description = "Updated description",
            parentId = null
        )

        every { taxonomyRepository.findById(taxonomyId) } returns null

        // WHEN: タクソノミー更新を実行した場合
        val exception = assertThrows(AppConflictException::class.java) {
            updateTaxonomyService.execute(command)
        }

        // THEN: IDが見つからないことを示す例外がスローされる
        assertEquals("Taxonomy with ID $taxonomyId not found", exception.message)
    }

    @Test
    @DisplayName("スラッグが別のタクソノミーに属している場合に例外をスローすること")
    fun `should throw exception when slug belongs to a different taxonomy`() {
        // GIVEN: 指定されたスラッグが別のタクソノミーに属している
        val taxonomyId = UUID.randomUUID()
        val conflictingTaxonomyId = UUID.randomUUID()

        val existingDto = TaxonomyDto(
            id = taxonomyId,
            name = "Existing Taxonomy",
            slug = "existing-slug",
            description = "Existing description",
            parentId = UUID.randomUUID(),
            createdAt = LocalDateTime.now()
        )

        val conflictingDto = TaxonomyDto(
            id = conflictingTaxonomyId,
            name = "Conflicting Taxonomy",
            slug = "updated-slug",
            description = "Conflicting description",
            parentId = null,
            createdAt = LocalDateTime.now()
        )

        val command = UpdateTaxonomyCommand(
            id = taxonomyId,
            name = "Updated Taxonomy",
            slug = "updated-slug",
            description = "Updated description",
            parentId = null
        )

        every { taxonomyRepository.findById(taxonomyId) } returns existingDto
        every { taxonomyRepository.findBySlug("updated-slug") } returns conflictingDto

        // WHEN: タクソノミー更新を実行した場合
        val exception = assertThrows(AppConflictException::class.java) {
            updateTaxonomyService.execute(command)
        }

        // THEN: スラッグの重複を示す例外がスローされる
        assertEquals(
            "The taxonomy with slug 'updated-slug' already exists and belongs to a different taxonomy.",
            exception.message
        )
    }
}

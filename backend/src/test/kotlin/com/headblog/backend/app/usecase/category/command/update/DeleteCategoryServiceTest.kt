package com.headblog.backend.app.usecase.category.command.update

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.shared.exception.AppConflictException
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import java.time.LocalDateTime
import java.util.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

class DeleteCategoryServiceTest {

    private val categoryRepository: CategoryRepository = mockk()
    private val updateCategoryService = UpdateCategoryService(categoryRepository)

    @Test
    @DisplayName("正常にカテゴリーが更新されること")
    fun `should update category successfully`() {
        // GIVEN: 既存のカテゴリーが存在し、スラッグがユニークである
        val categoryId = UUID.randomUUID()
        val existingDto = CategoryDto(
            id = categoryId,
            name = "Existing Category",
            slug = "existing-slug",
            description = "Existing description",
            parentId = UUID.randomUUID(),
            createdAt = LocalDateTime.now()
        )

        val command = UpdateCategoryCommand(
            id = categoryId,
            name = "Updated Category",
            slug = "updated-slug",
            description = "Updated description",
            parentId = null
        )

        every { categoryRepository.findById(categoryId) } returns existingDto
        every { categoryRepository.findBySlug("updated-slug") } returns null
        every { categoryRepository.update(any()) } returns 1

        // WHEN: カテゴリー更新を実行
        val result = updateCategoryService.execute(command)

        // THEN: 更新処理が成功し、リポジトリが更新メソッドを呼び出す
        assertEquals(CategoryId(categoryId), result)
        verify { categoryRepository.update(any()) }
    }

    @Test
    @DisplayName("カテゴリーが存在しない場合に例外をスローすること")
    fun `should throw exception when category not found`() {
        // GIVEN: 指定されたIDのカテゴリーが存在しない
        val categoryId = UUID.randomUUID()

        val command = UpdateCategoryCommand(
            id = categoryId,
            name = "Updated Category",
            slug = "updated-slug",
            description = "Updated description",
            parentId = null
        )

        every { categoryRepository.findById(categoryId) } returns null

        // WHEN: カテゴリー更新を実行した場合
        val exception = assertThrows(AppConflictException::class.java) {
            updateCategoryService.execute(command)
        }

        // THEN: IDが見つからないことを示す例外がスローされる
        assertEquals("Category with ID $categoryId not found", exception.message)
    }

    @Test
    @DisplayName("スラッグが別のカテゴリーに属している場合に例外をスローすること")
    fun `should throw exception when slug belongs to a different category`() {
        // GIVEN: 指定されたスラッグが別のカテゴリーに属している
        val categoryId = UUID.randomUUID()
        val conflictingCategoryId = UUID.randomUUID()

        val existingDto = CategoryDto(
            id = categoryId,
            name = "Existing Category",
            slug = "existing-slug",
            description = "Existing description",
            parentId = UUID.randomUUID(),
            createdAt = LocalDateTime.now()
        )

        val conflictingDto = CategoryDto(
            id = conflictingCategoryId,
            name = "Conflicting Category",
            slug = "updated-slug",
            description = "Conflicting description",
            parentId = null,
            createdAt = LocalDateTime.now()
        )

        val command = UpdateCategoryCommand(
            id = categoryId,
            name = "Updated Category",
            slug = "updated-slug",
            description = "Updated description",
            parentId = null
        )

        every { categoryRepository.findById(categoryId) } returns existingDto
        every { categoryRepository.findBySlug("updated-slug") } returns conflictingDto

        // WHEN: カテゴリー更新を実行した場合
        val exception = assertThrows(AppConflictException::class.java) {
            updateCategoryService.execute(command)
        }

        // THEN: スラッグの重複を示す例外がスローされる
        assertEquals(
            "The category with slug 'updated-slug' already exists and belongs to a different category.",
            exception.message
        )
    }
}

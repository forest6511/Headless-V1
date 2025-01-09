package com.headblog.backend.app.usecase.category.command.update

import com.headblog.backend.app.usecase.category.command.delete.DeleteCategoryService
import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.TranslationDto
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.category.Slug
import com.headblog.backend.domain.model.post.PostCategoryRepository
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
    private val postCategoryRepository: PostCategoryRepository = mockk()
    private val deleteCategoryService = DeleteCategoryService(categoryRepository, postCategoryRepository)

    val now = LocalDateTime.now()

    @Test
    @DisplayName("正常にカテゴリーが削除されること")
    fun `should delete category successfully`() {
        // GIVEN: カテゴリーとデフォルトカテゴリーが存在する
        val categoryId = UUID.randomUUID()
        val defaultCategoryId = UUID.randomUUID()
        val defaultTranslation = TranslationDto("ja", "デフォルト", null, now, now)
        val translation = TranslationDto("ja", "テスト", "説明", now, now)

        val targetDto = CategoryDto(
            id = categoryId,
            slug = "test-slug",
            parentId = null,
            translations = listOf(translation),
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

        val defaultDto = CategoryDto(
            id = defaultCategoryId,
            slug = Slug.DEFAULT_SLUG,
            parentId = null,
            translations = listOf(defaultTranslation),
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

        every { categoryRepository.findById(categoryId) } returns targetDto
        every { categoryRepository.findBySlug(Slug.DEFAULT_SLUG) } returns defaultDto
        every { categoryRepository.findAllByParentId(any()) } returns emptyList()
        every { postCategoryRepository.findPostsByCategoryId(any()) } returns emptyList()
        every { categoryRepository.delete(any()) } returns 1

        // WHEN: カテゴリー削除を実行
        val result = deleteCategoryService.execute(categoryId)

        // THEN: 削除処理が成功し、削除メソッドが呼び出される
        assertEquals(CategoryId(categoryId), result)
        verify { categoryRepository.delete(any()) }
    }

    @Test
    @DisplayName("カテゴリーが存在しない場合に例外をスローすること")
    fun `should throw exception when category not found`() {
        // GIVEN: 指定されたIDのカテゴリーが存在しない
        val categoryId = UUID.randomUUID()
        every { categoryRepository.findById(categoryId) } returns null

        // WHEN & THEN: カテゴリー削除実行時に例外がスローされる
        val exception = assertThrows(AppConflictException::class.java) {
            deleteCategoryService.execute(categoryId)
        }
        assertEquals("Category with ID $categoryId not found", exception.message)
    }

    @Test
    @DisplayName("デフォルトカテゴリーを削除しようとした場合に例外をスローすること")
    fun `should throw exception when trying to delete default category`() {
        // GIVEN: デフォルトカテゴリーを削除しようとする
        val defaultCategoryId = UUID.randomUUID()
        val translation = TranslationDto("ja", "デフォルト", null, LocalDateTime.now(), LocalDateTime.now())
        val defaultDto = CategoryDto(
            id = defaultCategoryId,
            slug = Slug.DEFAULT_SLUG,
            parentId = null,
            translations = listOf(translation),
            createdAt = now,
            updatedAt = now
        )

        every { categoryRepository.findById(defaultCategoryId) } returns defaultDto
        every { categoryRepository.findBySlug(Slug.DEFAULT_SLUG) } returns defaultDto

        // WHEN & THEN: カテゴリー削除実行時に例外がスローされる
        val exception = assertThrows(AppConflictException::class.java) {
            deleteCategoryService.execute(defaultCategoryId)
        }
        assertEquals("Cannot delete the default category", exception.message)
    }
}
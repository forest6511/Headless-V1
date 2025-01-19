package com.headblog.backend.infra.api.client.category.query

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.TranslationDto
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.category.Slug
import io.mockk.every
import io.mockk.mockk
import java.time.LocalDateTime
import java.util.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class GetClientCategoryQueryServiceImplTest {
    private val categoryRepository: CategoryRepository = mockk()
    private val queryService = GetClientCategoryQueryServiceImpl(categoryRepository)

    private companion object {
        val NOW: LocalDateTime = LocalDateTime.now()
        val DEFAULT_CATEGORY_ID: UUID = UUID.fromString("11111111-1111-1111-1111-111111111111")
        val IT_CATEGORY_ID: UUID = UUID.fromString("22222222-2222-2222-2222-222222222222")
        val PROGRAMMING_CATEGORY_ID: UUID = UUID.fromString("33333333-3333-3333-3333-333333333333")

        val TEST_CATEGORIES = listOf(
            CategoryDto(  // ITカテゴリーを先に定義
                id = IT_CATEGORY_ID,
                slug = "it",
                parentId = null,
                translations = listOf(
                    TranslationDto(
                        language = "ja",
                        name = "IT",
                        description = "ITに関する記事",
                        createdAt = NOW,
                        updatedAt = NOW
                    ),
                    TranslationDto(
                        language = "en",
                        name = "IT",
                        description = "Articles about Information Technology",
                        createdAt = NOW,
                        updatedAt = NOW
                    )
                ),
                createdAt = NOW,
                updatedAt = NOW
            ),
            CategoryDto(  // デフォルトカテゴリーを後に定義（ソートのテストのため）
                id = DEFAULT_CATEGORY_ID,
                slug = Slug.DEFAULT_SLUG,  // "uncategorized"
                parentId = null,
                translations = listOf(
                    TranslationDto(
                        language = "ja",
                        name = "未設定",
                        description = "未設定のカテゴリー",
                        createdAt = NOW,
                        updatedAt = NOW
                    ),
                    TranslationDto(
                        language = "en",
                        name = "Uncategorized",
                        description = "Uncategorized category",
                        createdAt = NOW,
                        updatedAt = NOW
                    )
                ),
                createdAt = NOW,
                updatedAt = NOW
            ),
            CategoryDto(
                id = PROGRAMMING_CATEGORY_ID,
                slug = "programming",
                parentId = IT_CATEGORY_ID,
                translations = listOf(
                    TranslationDto(
                        language = "ja",
                        name = "プログラミング",
                        description = "プログラミング関連の記事",
                        createdAt = NOW,
                        updatedAt = NOW
                    ),
                    TranslationDto(
                        language = "en",
                        name = "Programming",
                        description = "Articles about programming",
                        createdAt = NOW,
                        updatedAt = NOW
                    )
                ),
                createdAt = NOW,
                updatedAt = NOW
            )
        )
    }

    @Nested
    @DisplayName("getHierarchicalCategories のテスト")
    inner class GetHierarchicalCategoriesTest {
        @Test
        @DisplayName("階層構造のカテゴリーが正しく取得でき、未設定が最上位に来ること")
        fun `should return hierarchical categories correctly with uncategorized at top`() {
            // GIVEN
            every { categoryRepository.findAll() } returns TEST_CATEGORIES

            // WHEN
            val result = queryService.getHierarchicalCategories("ja")

            // THEN
            assertNotNull(result)
            assertEquals(2, result.size)  // ルートカテゴリーは2つ（未設定とIT）

            // 最上位が未設定カテゴリーであることを検証
            val defaultCategory = result.first()
            assertEquals(DEFAULT_CATEGORY_ID, defaultCategory.id)
            assertEquals(Slug.DEFAULT_SLUG, defaultCategory.slug)
            assertEquals("未設定", defaultCategory.name)
            assertEquals("未設定のカテゴリー", defaultCategory.description)
            assertTrue(defaultCategory.children.isEmpty())

            // 2番目がITカテゴリーであることを検証
            val itCategory = result[1]
            assertEquals(IT_CATEGORY_ID, itCategory.id)
            assertEquals("it", itCategory.slug)
            assertEquals("IT", itCategory.name)

            // ITの子カテゴリー（プログラミング）の検証
            assertEquals(1, itCategory.children.size)
            val programmingCategory = itCategory.children.first()
            assertEquals(PROGRAMMING_CATEGORY_ID, programmingCategory.id)
            assertEquals("programming", programmingCategory.slug)
            assertEquals("プログラミング", programmingCategory.name)
        }
    }
}
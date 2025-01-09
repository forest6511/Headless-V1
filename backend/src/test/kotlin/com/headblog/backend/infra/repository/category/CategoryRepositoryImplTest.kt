package com.headblog.backend.infra.repository.category

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.category.Language
import com.headblog.backend.domain.model.category.Translation
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.util.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class CategoryRepositoryImplTest {
    @Autowired
    lateinit var categoryRepository: CategoryRepository

    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>

    @Test
    @DisplayName("単一のカテゴリーを保存して取得できる")
    fun `should save and find single category`() {
        val category = createCategory("test-slug", listOf(createTranslation("ja", "テスト")))
        categoryRepository.save(category)

        val categoryDto = categoryRepository.findById(category.id.value)
        assertCategoryEquals(category, categoryDto)
    }

    @Test
    @DisplayName("スラグでカテゴリーを検索できる")
    fun `should find category by slug`() {
        val category = createCategory("test-slug", listOf(createTranslation("ja", "テスト")))
        categoryRepository.save(category)

        val categoryDto = categoryRepository.findBySlug("test-slug")

        assertNotNull(categoryDto)
        assertEquals(category.slug.value, categoryDto?.slug)
        assertEquals("テスト", categoryDto?.translations?.first()?.name)
    }

    @Test
    @DisplayName("親子関係のあるカテゴリーを保存できる")
    fun `should save category with parent`() {
        val parent = createCategory("parent-slug", listOf(createTranslation("ja", "親カテゴリ")))
        categoryRepository.save(parent)

        val child = createCategory("child-slug", listOf(createTranslation("ja", "子カテゴリ")), parent.id.value)
        categoryRepository.save(child)

        val foundChild = categoryRepository.findById(child.id.value)
        assertNotNull(foundChild)
        assertEquals(parent.id.value, child.parentId?.value)
    }

    @Test
    @DisplayName("親カテゴリーに子が存在するか確認できる")
    fun `should check if parent has children`() {
        val parent = createCategory("parent-slug", listOf(createTranslation("ja", "親カテゴリ")))
        categoryRepository.save(parent)

        assertFalse(categoryRepository.existsByParentId(parent.id.value))

        val child = createCategory("child-slug", listOf(createTranslation("ja", "子カテゴリ")), parent.id.value)
        categoryRepository.save(child)

        assertTrue(categoryRepository.existsByParentId(parent.id.value))
    }

    private fun createCategory(
        slug: String,
        translations: List<Translation>,
        parentId: UUID? = null
    ): Category = Category.create(idGenerator, slug, parentId, translations)

    private fun createTranslation(
        language: String,
        name: String,
        description: String? = null
    ): Translation = Translation(Language.of(language), name, description)

    private fun assertCategoryEquals(expected: Category, actual: CategoryDto?) {
        assertNotNull(actual)
        assertEquals(expected.slug.value, actual?.slug)
        assertEquals(expected.parentId?.value, actual?.parentId)
        assertEquals(expected.translations.size, actual?.translations?.size)
        expected.translations.forEachIndexed { index, translation ->
            assertEquals(translation.language.value, actual?.translations?.get(index)?.language)
            assertEquals(translation.name, actual?.translations?.get(index)?.name)
            assertEquals(translation.description, actual?.translations?.get(index)?.description)
        }
    }
}
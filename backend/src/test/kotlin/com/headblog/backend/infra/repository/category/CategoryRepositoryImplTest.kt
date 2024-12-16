package com.headblog.backend.infra.repository.category

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
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
        // Given
        val category = createCategory("Programming", "programming")

        // When
        categoryRepository.save(category)

        // Then
        val categoryDto = categoryRepository.findById(category.id.value)
        assertCategoryEquals(category, categoryDto)
    }

    @Test
    @DisplayName("スラグでカテゴリーを検索できる")
    fun `should find category by slug`() {
        // Given
        val category = createCategory("Development", "development")
        categoryRepository.save(category)

        // When
        val categoryDto = categoryRepository.findBySlug("development")

        // Then
        assertNotNull(categoryDto)
        assertEquals(category.slug.value, categoryDto?.slug)
        assertEquals(category.name, categoryDto?.name)
    }

    @Test
    @DisplayName("親子関係のあるカテゴリーを保存できる")
    fun `should save category with parent`() {
        // Given
        val parent = createCategory("Parent Category", "parent-category")
        categoryRepository.save(parent)

        // When
        val child = createCategory("Child Category", "child-category", parent.id.value)
        categoryRepository.save(child)

        // Then
        val foundChild = categoryRepository.findById(child.id.value)
        assertNotNull(foundChild)
        assertEquals(parent.id.value, child.parentId?.value)
    }

    @Test
    @DisplayName("親カテゴリーに子が存在するか確認できる")
    fun `should check if parent has children`() {
        // Given
        val parent = createCategory("Parent", "parent")
        categoryRepository.save(parent)

        // When
        assertFalse(categoryRepository.existsByParentId(parent.id.value))

        // Then
        val child = createCategory("Child", "child", parent.id.value)
        categoryRepository.save(child)

        assertTrue(categoryRepository.existsByParentId(parent.id.value))
    }

    private fun createCategory(name: String, slug: String, parentId: UUID? = null): Category =
        Category.create(idGenerator, name, slug, "Test description for $name", parentId)

    private fun assertCategoryEquals(expected: Category, actual: CategoryDto?) {
        assertNotNull(actual)
        assertEquals(expected.name, actual?.name)
        assertEquals(expected.slug.value, actual?.slug)
        assertEquals(expected.description, actual?.description)
        assertEquals(expected.parentId, actual?.parentId)
    }
}

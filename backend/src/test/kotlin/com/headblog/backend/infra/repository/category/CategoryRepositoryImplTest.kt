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
    @DisplayName("単一のタクソノミーを保存して取得できる")
    fun `should save and find single taxonomy`() {
        // Given
        val taxonomy = createTaxonomy("Programming", "programming")

        // When
        categoryRepository.save(taxonomy)

        // Then
        val taxonomyDto = categoryRepository.findById(taxonomy.id.value)
        assertTaxonomyEquals(taxonomy, taxonomyDto)
    }

    @Test
    @DisplayName("スラグでタクソノミーを検索できる")
    fun `should find taxonomy by slug`() {
        // Given
        val taxonomy = createTaxonomy("Development", "development")
        categoryRepository.save(taxonomy)

        // When
        val taxonomyDto = categoryRepository.findBySlug("development")

        // Then
        assertNotNull(taxonomyDto)
        assertEquals(taxonomy.slug.value, taxonomyDto?.slug)
        assertEquals(taxonomy.name, taxonomyDto?.name)
    }

    @Test
    @DisplayName("親子関係のあるタクソノミーを保存できる")
    fun `should save taxonomy with parent`() {
        // Given
        val parent = createTaxonomy("Parent Category", "parent-category")
        categoryRepository.save(parent)

        // When
        val child = createTaxonomy("Child Category", "child-category", parent.id.value)
        categoryRepository.save(child)

        // Then
        val foundChild = categoryRepository.findById(child.id.value)
        assertNotNull(foundChild)
        assertEquals(parent.id.value, child.parentId?.value)
    }

    @Test
    @DisplayName("親タクソノミーに子が存在するか確認できる")
    fun `should check if parent has children`() {
        // Given
        val parent = createTaxonomy("Parent", "parent")
        categoryRepository.save(parent)

        // When
        assertFalse(categoryRepository.existsByParentId(parent.id.value))

        // Then
        val child = createTaxonomy("Child", "child", parent.id.value)
        categoryRepository.save(child)

        assertTrue(categoryRepository.existsByParentId(parent.id.value))
    }

    private fun createTaxonomy(name: String, slug: String, parentId: UUID? = null): Category =
        Category.create(idGenerator, name, slug, "Test description for $name", parentId)

    private fun assertTaxonomyEquals(expected: Category, actual: CategoryDto?) {
        assertNotNull(actual)
        assertEquals(expected.name, actual?.name)
        assertEquals(expected.slug.value, actual?.slug)
        assertEquals(expected.description, actual?.description)
        assertEquals(expected.parentId, actual?.parentId)
    }
}

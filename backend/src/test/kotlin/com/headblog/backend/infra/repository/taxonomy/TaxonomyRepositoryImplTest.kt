package com.headblog.backend.infra.repository.taxonomy

import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
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
class TaxonomyRepositoryImplTest {

    @Autowired
    lateinit var taxonomyRepository: TaxonomyRepository

    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>

    @Test
    @DisplayName("単一のタクソノミーを保存して取得できる")
    fun `should save and find single taxonomy`() {
        // Given
        val taxonomy = createTaxonomy("Programming", "programming")

        // When
        taxonomyRepository.save(taxonomy)

        // Then
        val taxonomyDto = taxonomyRepository.findById(taxonomy.id.value)
        assertTaxonomyEquals(taxonomy, taxonomyDto)
    }

    @Test
    @DisplayName("スラグでタクソノミーを検索できる")
    fun `should find taxonomy by slug`() {
        // Given
        val taxonomy = createTaxonomy("Development", "development")
        taxonomyRepository.save(taxonomy)

        // When
        val taxonomyDto = taxonomyRepository.findBySlug("development")

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
        taxonomyRepository.save(parent)

        // When
        val child = createTaxonomy("Child Category", "child-category", parent.id.value)
        taxonomyRepository.save(child)

        // Then
        val foundChild = taxonomyRepository.findById(child.id.value)
        assertNotNull(foundChild)
        assertEquals(parent.id.value, child.parentId?.value)
    }

    @Test
    @DisplayName("親タクソノミーに子が存在するか確認できる")
    fun `should check if parent has children`() {
        // Given
        val parent = createTaxonomy("Parent", "parent")
        taxonomyRepository.save(parent)

        // When
        assertFalse(taxonomyRepository.existsByParentId(parent.id.value))

        // Then
        val child = createTaxonomy("Child", "child", parent.id.value)
        taxonomyRepository.save(child)

        assertTrue(taxonomyRepository.existsByParentId(parent.id.value))
    }

    private fun createTaxonomy(name: String, slug: String, parentId: UUID? = null): Taxonomy =
        Taxonomy.create(idGenerator, name, TaxonomyType.CATEGORY.name, slug, "Test description for $name", parentId)

    private fun assertTaxonomyEquals(expected: Taxonomy, actual: TaxonomyDto?) {
        assertNotNull(actual)
        assertEquals(expected.name, actual?.name)
        assertEquals(expected.slug.value, actual?.slug)
        assertEquals(expected.taxonomyType.name, actual?.taxonomyType)
        assertEquals(expected.description, actual?.description)
        assertEquals(expected.parentId, actual?.parentId)
    }
}

package com.headblog.backend.infra.repository.taxonomy

import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@ActiveProfiles("test")
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
        val savedTaxonomy = taxonomyRepository.save(taxonomy)

        // Then
        val foundTaxonomy = taxonomyRepository.findById(savedTaxonomy.id)
        assertTaxonomyEquals(taxonomy, foundTaxonomy)
    }

    @Test
    @DisplayName("スラグでタクソノミーを検索できる")
    fun `should find taxonomy by slug`() {
        // Given
        val taxonomy = createTaxonomy("Development", "development")
        taxonomyRepository.save(taxonomy)

        // When
        val foundTaxonomy = taxonomyRepository.findBySlug(taxonomy.slug)

        // Then
        assertNotNull(foundTaxonomy)
        assertEquals(taxonomy.slug, foundTaxonomy?.slug)
        assertEquals(taxonomy.name, foundTaxonomy?.name)
    }

    @Test
    @DisplayName("親子関係のあるタクソノミーを保存できる")
    fun `should save taxonomy with parent`() {
        // Given
        val parent = createTaxonomy("Parent Category", "parent-category")
        val savedParent = taxonomyRepository.save(parent)

        // When
        val child = createTaxonomy("Child Category", "child-category", savedParent.id)
        val savedChild = taxonomyRepository.save(child)

        // Then
        val foundChild = taxonomyRepository.findById(savedChild.id)
        assertNotNull(foundChild)
        assertEquals(savedParent.id.value, foundChild?.parentId?.value)
    }

    @Test
    @DisplayName("親タクソノミーに子が存在するか確認できる")
    fun `should check if parent has children`() {
        // Given
        val parent = createTaxonomy("Parent", "parent")
        val savedParent = taxonomyRepository.save(parent)

        // When
        assertFalse(taxonomyRepository.existsByParentId(savedParent.id))

        // Then
        val child = createTaxonomy("Child", "child", savedParent.id)
        taxonomyRepository.save(child)

        assertTrue(taxonomyRepository.existsByParentId(savedParent.id))
    }

    private fun createTaxonomy(name: String, slug: String, parentId: TaxonomyId? = null): Taxonomy =
        Taxonomy.create(idGenerator, name, TaxonomyType.CATEGORY, slug, "Test description for $name", parentId)

    private fun assertTaxonomyEquals(expected: Taxonomy, actual: Taxonomy?) {
        assertNotNull(actual)
        assertEquals(expected.name, actual?.name)
        assertEquals(expected.slug, actual?.slug)
        assertEquals(expected.taxonomyType, actual?.taxonomyType)
        assertEquals(expected.description, actual?.description)
        assertEquals(expected.parentId, actual?.parentId)
    }
}

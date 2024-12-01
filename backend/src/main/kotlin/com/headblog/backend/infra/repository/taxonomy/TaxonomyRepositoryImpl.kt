package com.headblog.backend.infra.repository.taxonomy

import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.infra.jooq.tables.references.TAXONOMIES
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class TaxonomyRepositoryImpl(
    private val dsl: DSLContext
) : TaxonomyRepository {

    override fun save(taxonomy: Taxonomy): Taxonomy {
        dsl.insertInto(TAXONOMIES)
            .set(TAXONOMIES.ID, taxonomy.id.value)
            .set(TAXONOMIES.NAME, taxonomy.name)
            .set(TAXONOMIES.TAXONOMY_TYPE, taxonomy.taxonomyType.name)
            .set(TAXONOMIES.SLUG, taxonomy.slug)
            .set(TAXONOMIES.DESCRIPTION, taxonomy.description)
            .set(TAXONOMIES.PARENT_ID, taxonomy.parentId?.value)
            .execute()
        return taxonomy
    }

    override fun findById(id: TaxonomyId): Taxonomy? {
        val result = dsl.selectFrom(TAXONOMIES)
            .where(TAXONOMIES.ID.eq(id.value))
            .fetchOne()

        return result?.into(Taxonomy::class.java)
    }

    override fun findBySlug(slug: String): Taxonomy? {
        val result = dsl.selectFrom(TAXONOMIES)
            .where(TAXONOMIES.SLUG.eq(slug))
            .fetchOne()

        return result?.into(Taxonomy::class.java)
    }

    override fun existsByParentId(parentId: TaxonomyId): Boolean {
        val count = dsl.selectCount()
            .from(TAXONOMIES)
            .where(TAXONOMIES.PARENT_ID.eq(parentId.value))
            .fetchOne(0, Int::class.java)
        return (count ?: 0) > 0
    }
}
package com.headblog.backend.infra.repository.post

import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostTaxonomyRepository
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.infra.jooq.tables.references.POST_TAXONOMIES
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class PostTaxonomyRepositoryImpl(
    private val dsl: DSLContext
) : PostTaxonomyRepository {

    override fun addRelation(postId: PostId, taxonomyId: TaxonomyId): Int {
        return dsl.insertInto(POST_TAXONOMIES)
            .set(POST_TAXONOMIES.POST_ID, postId.value)
            .set(POST_TAXONOMIES.TAXONOMY_ID, taxonomyId.value)
            .execute()
    }

    override fun deleteRelation(postId: PostId, taxonomyId: TaxonomyId): Int {
        return dsl.deleteFrom(POST_TAXONOMIES)
            .where(POST_TAXONOMIES.POST_ID.eq(postId.value))
            .and(POST_TAXONOMIES.TAXONOMY_ID.eq(taxonomyId.value))
            .execute()
    }

    override fun findTaxonomiesByPostId(postId: PostId): List<TaxonomyId> {
        return dsl.select(POST_TAXONOMIES.TAXONOMY_ID)
            .from(POST_TAXONOMIES)
            .where(POST_TAXONOMIES.POST_ID.eq(postId.value))
            .fetch()
            .map { TaxonomyId(it[POST_TAXONOMIES.TAXONOMY_ID]!!) }

    }

    override fun findPostsByTaxonomyId(taxonomyId: TaxonomyId): List<PostId> {
        return dsl.select(POST_TAXONOMIES.POST_ID)
            .from(POST_TAXONOMIES)
            .where(POST_TAXONOMIES.TAXONOMY_ID.eq(taxonomyId.value))
            .fetch()
            .map { PostId(it[POST_TAXONOMIES.POST_ID]!!) }
    }
}
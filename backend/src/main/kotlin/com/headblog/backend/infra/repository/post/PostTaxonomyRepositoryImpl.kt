package com.headblog.backend.infra.repository.post

import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostTaxonomyRepository
import com.headblog.infra.jooq.tables.references.POST_TAXONOMIES
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class PostTaxonomyRepositoryImpl(
    private val dsl: DSLContext
) : PostTaxonomyRepository {

    override fun addRelation(postId: PostId, categoryId: CategoryId): Int {
        return dsl.insertInto(POST_TAXONOMIES)
            .set(POST_TAXONOMIES.POST_ID, postId.value)
            .set(POST_TAXONOMIES.TAXONOMY_ID, categoryId.value)
            .execute()
    }

    override fun deleteRelation(postId: PostId, categoryId: CategoryId): Int {
        return dsl.deleteFrom(POST_TAXONOMIES)
            .where(POST_TAXONOMIES.POST_ID.eq(postId.value))
            .and(POST_TAXONOMIES.TAXONOMY_ID.eq(categoryId.value))
            .execute()
    }

    override fun findTaxonomiesByPostId(postId: PostId): List<CategoryId> {
        return dsl.select(POST_TAXONOMIES.TAXONOMY_ID)
            .from(POST_TAXONOMIES)
            .where(POST_TAXONOMIES.POST_ID.eq(postId.value))
            .fetch()
            .map { CategoryId(it[POST_TAXONOMIES.TAXONOMY_ID]!!) }

    }

    override fun findPostsByTaxonomyId(categoryId: CategoryId): List<PostId> {
        return dsl.select(POST_TAXONOMIES.POST_ID)
            .from(POST_TAXONOMIES)
            .where(POST_TAXONOMIES.TAXONOMY_ID.eq(categoryId.value))
            .fetch()
            .map { PostId(it[POST_TAXONOMIES.POST_ID]!!) }
    }
}
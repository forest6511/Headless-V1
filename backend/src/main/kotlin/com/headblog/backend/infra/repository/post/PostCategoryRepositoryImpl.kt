package com.headblog.backend.infra.repository.post

import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostId
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class PostCategoryRepositoryImpl(
    private val dsl: DSLContext
) : PostCategoryRepository {

    override fun addRelation(postId: PostId, categoryId: CategoryId): Int {
        return dsl.insertInto(POST_CATEGORIES)
            .set(POST_CATEGORIES.POST_ID, postId.value)
            .set(POST_CATEGORIES.CATEGORY_ID, categoryId.value)
            .execute()
    }

    override fun deleteRelation(postId: PostId, categoryId: CategoryId): Int {
        return dsl.deleteFrom(POST_CATEGORIES)
            .where(POST_CATEGORIES.POST_ID.eq(postId.value))
            .and(POST_CATEGORIES.CATEGORY_ID.eq(categoryId.value))
            .execute()
    }

    override fun findCategoriesByPostId(postId: PostId): List<CategoryId> {
        return dsl.select(POST_CATEGORIES.CATEGORY_ID)
            .from(POST_CATEGORIES)
            .where(POST_CATEGORIES.POST_ID.eq(postId.value))
            .fetch()
            .map { CategoryId(it[POST_CATEGORIES.CATEGORY_ID]!!) }

    }

    override fun findPostsByCategoryId(categoryId: CategoryId): List<PostId> {
        return dsl.select(POST_CATEGORIES.POST_ID)
            .from(POST_CATEGORIES)
            .where(POST_CATEGORIES.CATEGORY_ID.eq(categoryId.value))
            .fetch()
            .map { PostId(it[POST_CATEGORIES.POST_ID]!!) }
    }
}
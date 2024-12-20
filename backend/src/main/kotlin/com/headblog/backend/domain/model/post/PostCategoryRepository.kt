package com.headblog.backend.domain.model.post

import com.headblog.backend.domain.model.category.CategoryId

interface PostCategoryRepository {
    fun addRelation(postId: PostId, categoryId: CategoryId): Int
    fun updateRelation(postId: PostId, categoryId: CategoryId): Int
    fun deleteRelation(postId: PostId, categoryId: CategoryId): Int
    fun findCategoriesByPostId(postId: PostId): List<CategoryId>
    fun findPostsByCategoryId(categoryId: CategoryId): List<PostId>
}
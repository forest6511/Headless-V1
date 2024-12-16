package com.headblog.backend.domain.model.post

import com.headblog.backend.domain.model.taxonomy.CategoryId

interface PostTaxonomyRepository {
    fun addRelation(postId: PostId, categoryId: CategoryId): Int
    fun deleteRelation(postId: PostId, categoryId: CategoryId): Int
    fun findTaxonomiesByPostId(postId: PostId): List<CategoryId>
    fun findPostsByTaxonomyId(categoryId: CategoryId): List<PostId>
}
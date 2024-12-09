package com.headblog.backend.domain.model.post

import com.headblog.backend.domain.model.taxonomy.TaxonomyId

interface PostTaxonomyRepository {
    fun addRelation(postId: PostId, taxonomyId: TaxonomyId): Int
    fun deleteRelation(postId: PostId, taxonomyId: TaxonomyId): Int
    fun findTaxonomiesByPostId(postId: PostId): List<TaxonomyId>
    fun findPostsByTaxonomyId(taxonomyId: TaxonomyId): List<PostId>
}
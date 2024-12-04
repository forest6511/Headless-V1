package com.headblog.backend.app.usecase.taxonomy.query

import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import java.time.LocalDateTime
import java.util.*

data class TaxonomyWithPostRefsDto(
    val id: TaxonomyId,
    val name: String,
    val taxonomyType: TaxonomyType,
    val slug: String,
    val description: String?,
    val parentId: UUID?,
    val createdAt: LocalDateTime,
    val postIds: List<PostId>
)

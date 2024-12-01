package com.headblog.backend.application.usecase.taxonomy.query

import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import java.time.LocalDateTime
import java.util.*

data class TaxonomyDto(
    val id: UUID,
    val name: String,
    val taxonomyType: TaxonomyType,
    val slug: String,
    val description: String?,
    val parentId: UUID?,
    val createdAt: LocalDateTime
)
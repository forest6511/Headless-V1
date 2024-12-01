package com.headblog.backend.app.usecase.taxonomy.command

import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.domain.model.taxonomy.TaxonomyType

data class CreateTaxonomyCommand(
    val name: String,
    val taxonomyType: TaxonomyType,
    val slug: String,
    val description: String?,
    val parentId: TaxonomyId?
)
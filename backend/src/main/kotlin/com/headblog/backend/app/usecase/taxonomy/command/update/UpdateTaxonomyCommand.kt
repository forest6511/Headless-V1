package com.headblog.backend.app.usecase.taxonomy.command.update

import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import java.util.*

data class UpdateTaxonomyCommand(
    val id: UUID,
    val name: String,
    val taxonomyType: TaxonomyType,
    val slug: String,
    val description: String?,
    val parentId: UUID?
)
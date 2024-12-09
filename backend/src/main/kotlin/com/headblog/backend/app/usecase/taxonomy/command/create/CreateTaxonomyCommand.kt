package com.headblog.backend.app.usecase.taxonomy.command.create

import java.util.*

data class CreateTaxonomyCommand(
    val name: String,
    val taxonomyType: String,
    val slug: String,
    val description: String?,
    val parentId: UUID?
)
package com.headblog.backend.app.usecase.taxonomy.command.update

import java.util.*

data class UpdateTaxonomyCommand(
    val id: UUID,
    val name: String,
    val slug: String,
    val description: String?,
    val parentId: UUID?
)
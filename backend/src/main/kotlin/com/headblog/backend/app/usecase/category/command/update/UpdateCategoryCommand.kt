package com.headblog.backend.app.usecase.category.command.update

import java.util.*

data class UpdateCategoryCommand(
    val id: UUID,
    val name: String,
    val slug: String,
    val description: String?,
    val parentId: UUID?
)
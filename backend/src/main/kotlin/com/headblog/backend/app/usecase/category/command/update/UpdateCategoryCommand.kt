package com.headblog.backend.app.usecase.category.command.update

import java.util.*

data class UpdateCategoryCommand(
    val id: UUID,
    val language: String,
    val name: String,
    val description: String?,
    val parentId: UUID?
)
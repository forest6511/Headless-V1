package com.headblog.backend.app.usecase.category.command.create

import java.util.*

data class CreateCategoryCommand(
    val language: String,
    val name: String,
    val description: String?,
    val parentId: UUID?
)
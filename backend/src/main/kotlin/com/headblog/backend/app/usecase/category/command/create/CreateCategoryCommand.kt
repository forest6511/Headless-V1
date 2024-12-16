package com.headblog.backend.app.usecase.category.command.create

import java.util.*

data class CreateCategoryCommand(
    val name: String,
    val slug: String,
    val description: String?,
    val parentId: UUID?
)
package com.headblog.backend.app.usecase.category.command.create

import com.headblog.backend.domain.model.category.CategoryId

interface CreateCategoryUseCase {
    fun execute(command: CreateCategoryCommand): CategoryId
}
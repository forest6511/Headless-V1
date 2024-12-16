package com.headblog.backend.app.usecase.category.command.update

import com.headblog.backend.domain.model.category.CategoryId

interface UpdateCategoryUseCase {
    fun execute(command: UpdateCategoryCommand): CategoryId
}
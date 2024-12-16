package com.headblog.backend.app.usecase.category.command.delete

import com.headblog.backend.domain.model.category.CategoryId

interface DeleteCategoryUseCase {
    fun execute(command: DeleteCategoryCommand): CategoryId
}
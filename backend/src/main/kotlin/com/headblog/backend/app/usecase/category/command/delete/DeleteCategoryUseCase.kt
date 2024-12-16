package com.headblog.backend.app.usecase.category.command.delete

import com.headblog.backend.domain.model.category.CategoryId
import java.util.*

interface DeleteCategoryUseCase {
    fun execute(deleteId: UUID): CategoryId
}
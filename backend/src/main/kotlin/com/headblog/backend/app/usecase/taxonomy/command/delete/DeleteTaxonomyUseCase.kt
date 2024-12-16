package com.headblog.backend.app.usecase.taxonomy.command.delete

import com.headblog.backend.domain.model.taxonomy.CategoryId

interface DeleteTaxonomyUseCase {
    fun execute(command: DeleteTaxonomyCommand): CategoryId
}
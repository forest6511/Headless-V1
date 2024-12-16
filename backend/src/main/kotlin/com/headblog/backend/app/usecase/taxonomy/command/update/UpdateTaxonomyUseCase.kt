package com.headblog.backend.app.usecase.taxonomy.command.update

import com.headblog.backend.domain.model.taxonomy.CategoryId

interface UpdateTaxonomyUseCase {
    fun execute(command: UpdateTaxonomyCommand): CategoryId
}
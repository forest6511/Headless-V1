package com.headblog.backend.app.usecase.taxonomy.command.create

import com.headblog.backend.domain.model.taxonomy.CategoryId

interface CreateTaxonomyUseCase {
    fun execute(command: CreateTaxonomyCommand): CategoryId
}
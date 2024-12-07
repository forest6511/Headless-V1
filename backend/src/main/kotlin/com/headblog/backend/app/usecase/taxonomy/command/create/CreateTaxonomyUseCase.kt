package com.headblog.backend.app.usecase.taxonomy.command.create

import com.headblog.backend.domain.model.taxonomy.TaxonomyId

interface CreateTaxonomyUseCase {
    fun execute(command: CreateTaxonomyCommand): TaxonomyId
}
package com.headblog.backend.app.usecase.taxonomy.command

import com.headblog.backend.domain.model.taxonomy.TaxonomyId

interface CreateTaxonomyUseCase {
    fun execute(command: CreateTaxonomyCommand): TaxonomyId
}
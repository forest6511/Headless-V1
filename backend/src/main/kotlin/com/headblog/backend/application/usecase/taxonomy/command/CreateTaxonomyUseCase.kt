package com.headblog.backend.application.usecase.taxonomy.command

import com.headblog.backend.domain.model.taxonomy.TaxonomyId

interface CreateTaxonomyUseCase {
    suspend fun execute(command: CreateTaxonomyCommand): TaxonomyId
}
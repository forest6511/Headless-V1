package com.headblog.backend.app.usecase.taxonomy.command.update

import com.headblog.backend.domain.model.taxonomy.TaxonomyId

interface UpdateTaxonomyUseCase {
    fun execute(command: UpdateTaxonomyCommand): TaxonomyId
}
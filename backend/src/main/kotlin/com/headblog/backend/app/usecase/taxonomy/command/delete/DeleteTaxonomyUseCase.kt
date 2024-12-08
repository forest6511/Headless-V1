package com.headblog.backend.app.usecase.taxonomy.command.delete

import com.headblog.backend.domain.model.taxonomy.TaxonomyId

interface DeleteTaxonomyUseCase {
    fun execute(command: DeleteTaxonomyCommand): TaxonomyId
}
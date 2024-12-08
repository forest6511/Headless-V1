package com.headblog.backend.infra.api.taxonomy.request

import jakarta.validation.constraints.NotNull
import java.util.*

data class DeleteTaxonomyRequest(
    @field:NotNull(message = "ID is required")
    val id: UUID,
)

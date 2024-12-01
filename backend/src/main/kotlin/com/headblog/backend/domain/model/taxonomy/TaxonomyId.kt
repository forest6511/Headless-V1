package com.headblog.backend.domain.model.taxonomy

import com.headblog.backend.shared.id.domain.EntityId
import java.util.*

data class TaxonomyId(override val value: UUID) : EntityId


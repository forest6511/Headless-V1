package com.headblog.backend.domain.model.taxonomy

import com.headblog.backend.shared.id.domain.EntityId
import java.util.*

data class CategoryId(override val value: UUID) : EntityId


package com.headblog.backend.domain.model.tag

import com.headblog.backend.shared.id.domain.EntityId
import java.util.*

data class TagId(override val value: UUID) : EntityId


package com.headblog.backend.domain.model.post

import com.headblog.backend.shared.id.domain.EntityId
import java.util.*

data class PostId(override val value: UUID) : EntityId

package com.headblog.backend.domain.model.user

import com.headblog.backend.shared.id.domain.EntityId
import java.util.*

data class UserId(override val value: UUID) : EntityId

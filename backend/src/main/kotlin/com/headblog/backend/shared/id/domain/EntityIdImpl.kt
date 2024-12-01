package com.headblog.backend.shared.id.domain

import java.util.*

@JvmInline
value class EntityIdImpl(override val value: UUID) : EntityId
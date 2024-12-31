package com.headblog.backend.domain.model.media

import com.headblog.backend.shared.id.domain.EntityId
import java.util.*

data class MediaId(override val value: UUID) : EntityId

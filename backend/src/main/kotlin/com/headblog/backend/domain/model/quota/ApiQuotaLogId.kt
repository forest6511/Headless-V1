package com.headblog.backend.domain.model.quota

import com.headblog.backend.shared.id.domain.EntityId
import java.util.*

data class ApiQuotaLogId(override val value: UUID) : EntityId

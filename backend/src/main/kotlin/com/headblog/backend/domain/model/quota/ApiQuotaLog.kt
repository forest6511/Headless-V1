package com.headblog.backend.domain.model.quota

import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDate
import java.time.LocalDateTime

data class ApiQuotaLog(
    val id: ApiQuotaLogId,
    val service: String,
    val quotaDate: LocalDate,
    val dailyQuota: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun create(
            id: IdGenerator<EntityId>,
            service: String,
            quotaDate: LocalDate,
            dailyQuota: Int,
            createdAt: LocalDateTime,
            updatedAt: LocalDateTime,
        ): ApiQuotaLog {
            return ApiQuotaLog(
                id = ApiQuotaLogId(id.generate().value),
                service = service,
                quotaDate = quotaDate,
                dailyQuota = dailyQuota,
                createdAt = createdAt,
                updatedAt = updatedAt
            )
        }
    }
}


package com.headblog.backend.domain.model.quota

import java.time.LocalDate

interface ApiQuotaRepository {
    fun findByServiceAndDate(service: String, date: LocalDate): ApiQuotaLog?
    fun save(apiQuotaLog: ApiQuotaLog)
    fun findByServiceBetweenDates(
        service: String,
        startDate: LocalDate,
        endDate: LocalDate
    ): List<ApiQuotaLog>
}
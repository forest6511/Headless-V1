package com.headblog.backend.domain.model.quota

import com.headblog.backend.shared.exceptions.AppConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDate
import java.time.LocalDateTime
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class QuotaManagementService(
    private val apiQuotaRepository: ApiQuotaRepository,
    private val idGenerator: IdGenerator<EntityId>,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    companion object {
        private const val DAILY_LIMIT = 500
    }

    fun checkAndIncrementQuota(service: String) {
        val today = LocalDate.now()
        val currentQuota = apiQuotaRepository.findByServiceAndDate(service, today)

        if ((currentQuota?.dailyQuota ?: 0) >= DAILY_LIMIT) {
            throw AppConflictException("Daily quota exceeded for service: $service")
        }

        val apiQuotaLog = currentQuota?.copy(
            dailyQuota = currentQuota.dailyQuota + 1,
            updatedAt = LocalDateTime.now()
        )
            ?: ApiQuotaLog.create(
                id = idGenerator,
                service = service,
                quotaDate = LocalDate.now(),
                dailyQuota = 1,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )

        apiQuotaRepository.save(apiQuotaLog)
    }

    fun getDailyUsage(service: String, date: LocalDate): Int {
        return apiQuotaRepository.findByServiceAndDate(service, date)?.dailyQuota ?: 0
    }

    fun getWeeklyUsage(service: String): List<ApiQuotaLog> {
        val endDate = LocalDate.now()
        val startDate = endDate.minusDays(6)
        return apiQuotaRepository.findByServiceBetweenDates(service, startDate, endDate)
    }
}
package com.headblog.backend.infra.repository.quota

import com.headblog.backend.domain.model.quota.ApiQuotaLog
import com.headblog.backend.domain.model.quota.ApiQuotaLogId
import com.headblog.backend.domain.model.quota.ApiQuotaRepository
import com.headblog.infra.jooq.tables.references.API_QUOTA_LOGS
import java.time.LocalDate
import java.time.LocalDateTime
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository

@Repository
class ApiQuotaRepositoryImpl(
    private val dsl: DSLContext,
) : ApiQuotaRepository {

    override fun findByServiceAndDate(service: String, date: LocalDate): ApiQuotaLog? {
        return dsl.select(API_QUOTA_LOGS.asterisk())
            .from(API_QUOTA_LOGS)
            .where(
                API_QUOTA_LOGS.SERVICE.eq(service)
                    .and(API_QUOTA_LOGS.QUOTA_DATE.eq(date))
            )
            .fetchOne()
            ?.toApiQuotaLog()
    }

    override fun save(apiQuotaLog: ApiQuotaLog) {
        dsl.insertInto(API_QUOTA_LOGS)
            .set(API_QUOTA_LOGS.ID, apiQuotaLog.id.value)
            .set(API_QUOTA_LOGS.SERVICE, apiQuotaLog.service)
            .set(API_QUOTA_LOGS.QUOTA_DATE, apiQuotaLog.quotaDate)
            .set(API_QUOTA_LOGS.DAILY_QUOTA, apiQuotaLog.dailyQuota)
            .set(API_QUOTA_LOGS.CREATED_AT, apiQuotaLog.createdAt)
            .set(API_QUOTA_LOGS.UPDATED_AT, apiQuotaLog.updatedAt)
            .onConflict(API_QUOTA_LOGS.SERVICE, API_QUOTA_LOGS.QUOTA_DATE)
            .doUpdate()
            .set(API_QUOTA_LOGS.DAILY_QUOTA, apiQuotaLog.dailyQuota)
            .set(API_QUOTA_LOGS.UPDATED_AT, LocalDateTime.now())
            .execute()
    }

    override fun findByServiceBetweenDates(
        service: String,
        startDate: LocalDate,
        endDate: LocalDate
    ): List<ApiQuotaLog> {
        return dsl.select(API_QUOTA_LOGS.asterisk())
            .from(API_QUOTA_LOGS)
            .where(
                API_QUOTA_LOGS.SERVICE.eq(service)
                    .and(API_QUOTA_LOGS.QUOTA_DATE.between(startDate, endDate))
            )
            .orderBy(API_QUOTA_LOGS.QUOTA_DATE.desc())
            .fetch()
            .map { it.toApiQuotaLog() }
    }

    private fun Record.toApiQuotaLog(): ApiQuotaLog {
        return ApiQuotaLog(
            id = ApiQuotaLogId(requireNotNull(get(API_QUOTA_LOGS.ID))),
            service = requireNotNull(get(API_QUOTA_LOGS.SERVICE)),
            quotaDate = requireNotNull(get(API_QUOTA_LOGS.QUOTA_DATE)),
            dailyQuota = requireNotNull(get(API_QUOTA_LOGS.DAILY_QUOTA)),
            createdAt = requireNotNull(get(API_QUOTA_LOGS.CREATED_AT)),
            updatedAt = requireNotNull(get(API_QUOTA_LOGS.UPDATED_AT))
        )
    }
}
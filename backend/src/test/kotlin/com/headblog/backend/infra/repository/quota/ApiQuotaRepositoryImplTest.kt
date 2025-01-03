package com.headblog.backend.infra.repository.quota

import com.headblog.backend.domain.model.quota.ApiQuotaLog
import com.headblog.backend.domain.model.quota.ApiQuotaRepository
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDate
import java.time.LocalDateTime
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional


@SpringBootTest
@Transactional
class ApiQuotaRepositoryImplTest {

    @Autowired
    lateinit var apiQuotaRepository: ApiQuotaRepository

    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>

    @Test
    @DisplayName("サービスと日付でクォータログを取得できる")
    fun `should find quota log by service and date`() {
        // Given
        val service = "test-service"
        val date = LocalDate.now()
        val apiQuotaLog = createAndSaveApiQuotaLog(service, date)

        // When
        val foundLog = apiQuotaRepository.findByServiceAndDate(service, date)

        // Then
        assertNotNull(foundLog)
        assertEquals(apiQuotaLog.service, foundLog?.service)
        assertEquals(apiQuotaLog.quotaDate, foundLog?.quotaDate)
        assertEquals(apiQuotaLog.dailyQuota, foundLog?.dailyQuota)
    }

    @Test
    @DisplayName("日付範囲内のクォータログを取得できる")
    fun `should find quota logs between dates`() {
        // Given
        val service = "test-service"
        val baseDate = LocalDate.now()
        val startDate = baseDate.minusDays(5)

        val expectedDates = listOf(
            baseDate,
            baseDate.minusDays(1),
            baseDate.minusDays(2),
            baseDate.minusDays(3),
            baseDate.minusDays(4),
            baseDate.minusDays(5)
        )
        val expectedQuotas = (6 downTo 1).toList()

        // 複数のログを作成（現在の日付を含む）
        (0..5).forEach { i ->
            createAndSaveApiQuotaLog(service, startDate.plusDays(i.toLong()), i + 1)
        }

        // When
        val foundLogs = apiQuotaRepository.findByServiceBetweenDates(service, startDate, baseDate)

        // Then
        assertEquals(6, foundLogs.size)
        foundLogs.forEachIndexed { index, log ->
            assertEquals(service, log.service)
            assertEquals(expectedDates[index], log.quotaDate)
            assertEquals(expectedQuotas[index], log.dailyQuota)
        }
    }

    @Test
    @DisplayName("クォータログを保存・更新できる")
    fun `should save and update quota log`() {
        // Given
        val service = "test-service"
        val date = LocalDate.now()

        // 初回保存
        val initialLog = createAndSaveApiQuotaLog(service, date)

        // 同じサービスと日付のログを更新
        val updatedLog = initialLog.copy(dailyQuota = initialLog.dailyQuota + 10)
        apiQuotaRepository.save(updatedLog)

        // When
        val foundLog = apiQuotaRepository.findByServiceAndDate(service, date)

        // Then
        assertNotNull(foundLog)
        assertEquals(updatedLog.dailyQuota, foundLog?.dailyQuota)
    }

    private fun createAndSaveApiQuotaLog(
        service: String,
        date: LocalDate,
        dailyQuota: Int = 1
    ): ApiQuotaLog {
        val apiQuotaLog = ApiQuotaLog.create(
            id = idGenerator,
            service = service,
            quotaDate = date,
            dailyQuota = dailyQuota,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        apiQuotaRepository.save(apiQuotaLog)
        return apiQuotaLog
    }
}
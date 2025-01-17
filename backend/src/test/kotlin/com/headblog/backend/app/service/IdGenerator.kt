package com.headblog.backend.app.service

import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.Instant
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class IdGenerator {
    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>

    @Test
    @DisplayName("UUIDv7を取得できること")
    fun `should generate a version7 UUID`() {
        // バージョン7のUUIDを生成する処理
        val uuid = idGenerator.generate().value
        println("Generated UUID: $uuid")

        // UUIDバージョンをチェック
        require(uuid.version() == 7) { "This method only supports version 7 UUID" }

        // バージョン7 UUIDのMSB上位48ビットがエポックミリ秒となる
        val epochMillis = uuid.mostSignificantBits ushr 16
        val instant = Instant.ofEpochMilli(epochMillis)
        println("Extracted time from UUIDv7: $instant")
    }
}
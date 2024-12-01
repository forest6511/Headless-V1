package com.headblog.backend.shared.id.domain

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import java.util.*

class UuidV7GeneratorTest {

    @Test
    @DisplayName("UUID v7が有効に生成されること")
    fun `should generate valid UUID v7`() {
        val generator = UuidV7Generator()
        val entityId = generator.generate()

        assertNotNull(entityId)
        assertNotNull(entityId.value)
        assertEquals(7, entityId.value.version())
    }

    @Test
    @DisplayName("生成されたIDがユニークであること")
    fun `should generate unique IDs`() {
        val generator = UuidV7Generator()
        val iterations = 1000
        val generatedIds = mutableSetOf<EntityId>()

        assertDoesNotThrow {
            repeat(iterations) {
                val id = generator.generate()
                assertTrue(generatedIds.add(id), "生成されたIDはユニークであるべきです")
            }
        }
    }

    @Test
    @DisplayName("生成されるIDが時系列順であること")
    fun `should generate time-ordered IDs`() {
        val generator = UuidV7Generator()

        val id1 = generator.generate().value
        Thread.sleep(1)
        val id2 = generator.generate().value

        val time1 = extractTimeFromUuid(id1)
        val time2 = extractTimeFromUuid(id2)

        assertTrue(time1 < time2, "2番目に生成されたIDは、より遅いタイムスタンプを持つべきです")
    }

    private fun extractTimeFromUuid(uuid: UUID): Long {
        val mostSigBits = uuid.mostSignificantBits
        return mostSigBits shr 16
    }
}

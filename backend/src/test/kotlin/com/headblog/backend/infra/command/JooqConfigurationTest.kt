package com.headblog.backend.infra.command

import org.jooq.DSLContext
import org.jooq.SQLDialect
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

@SpringBootTest
class JooqConfigurationTest {
    @Autowired
    private lateinit var dsl: DSLContext

    @Test
    fun `should verify JOOQ connection and schema`() {
        val tables = dsl.meta().tables
        assertNotNull(tables)
        assertTrue(tables.any { it.name == "posts" })
    }

    @Test
    fun `should verify all required tables exist`() {
        val expectedTables = setOf(
            "users",
            "social_connections",
            "refresh_tokens",
            "posts",
            "revisions",
            "taxonomies",
            "post_taxonomies",
            "media"
        )

        val actualTables = dsl.meta().tables.map { it.name.lowercase() }.filter { it in expectedTables }.toSet()
        assertEquals(expectedTables, actualTables)
    }

    @Test
    fun `should verify database dialect`() {
        assertEquals(SQLDialect.POSTGRES, dsl.configuration().dialect())
    }
}
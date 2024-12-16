plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	id("org.springframework.boot") version "3.4.0"
	id("io.spring.dependency-management") version "1.1.6"
	id("org.asciidoctor.jvm.convert") version "4.0.3"
 	id("org.jooq.jooq-codegen-gradle") version "3.19.15"
	id("org.flywaydb.flyway") version "11.1.0"
}

group = "com.headblog"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

extra["snippetsDir"] = file("build/generated-snippets")

dependencies {
	implementation(kotlin("stdlib"))
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-jooq")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

	implementation("org.flywaydb:flyway-core:11.1.0")
	runtimeOnly("org.flywaydb:flyway-database-postgresql:11.1.0")

	implementation("org.jetbrains.kotlin:kotlin-reflect")
	runtimeOnly("org.postgresql:postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	testImplementation("io.mockk:mockk:1.12.0")

	implementation("org.jooq:jooq-meta")
	implementation("org.jooq:jooq-codegen")
	implementation("org.jooq:jooq-postgres-extensions:3.19.15")
	jooqCodegen("org.postgresql:postgresql:42.7.3")

	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.0")
	// https://github.com/f4b6a3/uuid-creator
	implementation("com.github.f4b6a3:uuid-creator:6.0.0")
	// https://github.com/auth0/java-jwt
	implementation("com.auth0:java-jwt:4.4.0")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

buildscript {
	dependencies {
		classpath("org.flywaydb:flyway-database-postgresql:11.1.0")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
	systemProperty("spring.profiles.active", "test")
}

tasks.test {
	outputs.dir(project.extra["snippetsDir"]!!)
}

tasks.asciidoctor {
	inputs.dir(project.extra["snippetsDir"]!!)
	dependsOn(tasks.test)
}

project.ext {
	extra["db.url"] = System.getenv("DB_URL") ?: "jdbc:postgresql://localhost:5432/headblog"
	extra["db.user"] = System.getenv("DB_USER") ?: "headblog"
	extra["db.password"] = System.getenv("DB_PASSWORD") ?: "headblog"
	extra["db.schema"] = System.getenv("DB_SCHEMA") ?: "public"
}

flyway {
	url = System.getProperty("spring.datasource.url", project.ext["db.url"] as String)
	user = System.getProperty("spring.datasource.username", project.ext["db.user"] as String)
	password = System.getProperty("spring.datasource.password", project.ext["db.password"] as String)
	locations = arrayOf("filesystem:src/main/resources/db/migration")
}

jooq {
	configuration {
		jdbc {
			driver = "org.postgresql.Driver"
			url = System.getProperty("spring.datasource.url", project.ext["db.url"] as String)
			user = System.getProperty("spring.datasource.username", project.ext["db.user"] as String)
			password = System.getProperty("spring.datasource.password", project.ext["db.password"] as String)
		}
		generator {
			name = "org.jooq.codegen.KotlinGenerator"
			database {
				name = "org.jooq.meta.postgres.PostgresDatabase"
				inputSchema = System.getProperty("spring.datasource.schema", project.ext["db.schema"] as String)
				includes = ".*"
				excludes = """
                    flyway_schema_history | 
                    pg_.*                 |
                    sql_.*
                """.trimMargin()
				schemaVersionProvider = "SELECT MAX(\"version\") FROM \"flyway_schema_history\""
			}
			generate {
				isDeprecated = false
				isRecords = true
				isImmutablePojos = true
				isFluentSetters = true
			}
			target {
				packageName = "com.headblog.infra.jooq"
				directory = "build/generated-sources/jooq"
			}
		}
	}
}

sourceSets.main {
	java.srcDirs("build/generated-sources/jooq")
}

tasks.named("jooqCodegen") {
	dependsOn("flywayMigrate")
}

tasks.named("compileKotlin") {
	dependsOn(tasks.named("jooqCodegen"))
}
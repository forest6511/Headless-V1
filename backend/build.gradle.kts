plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	id("org.springframework.boot") version "3.4.0"
	id("io.spring.dependency-management") version "1.1.6"
	id("org.asciidoctor.jvm.convert") version "3.3.2"
	id("org.jooq.jooq-codegen-gradle") version "3.19.15"
	id("org.flywaydb.flyway") version "9.22.1"
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
	implementation("org.flywaydb:flyway-core")
	implementation("org.flywaydb:flyway-database-postgresql")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	runtimeOnly("org.postgresql:postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	testImplementation("org.testcontainers:postgresql")
	testImplementation("org.testcontainers:junit-jupiter")

	"jooqCodegen"("org.jooq:jooq-codegen:3.19.15")
	"jooqCodegen"("org.postgresql:postgresql:42.7.3")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.test {
	outputs.dir(project.extra["snippetsDir"]!!)
}

tasks.asciidoctor {
	inputs.dir(project.extra["snippetsDir"]!!)
	dependsOn(tasks.test)
}

project.ext {
	set("db.url", System.getenv("DB_URL") ?: "jdbc:postgresql://localhost:5432/headblog")
	set("db.user", System.getenv("DB_USER") ?: "headblog")
	set("db.password", System.getenv("DB_PASSWORD") ?: "headblog")
	set("db.schema", System.getenv("DB_SCHEMA") ?: "public")
}

flyway {
	url = project.ext["db.url"] as String
	user = project.ext["db.user"] as String
	password = project.ext["db.password"] as String
	locations = arrayOf("filesystem:src/main/resources/db/migration")
}

jooq {
	configuration {
		jdbc {
			driver = "org.postgresql.Driver"
			url = project.ext["db.url"] as String
			user = project.ext["db.user"] as String
			password = project.ext["db.password"] as String
		}
		generator {
			name = "org.jooq.codegen.KotlinGenerator"
			database {
				name = "org.jooq.meta.postgres.PostgresDatabase"
				inputSchema = project.ext["db.schema"] as String
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
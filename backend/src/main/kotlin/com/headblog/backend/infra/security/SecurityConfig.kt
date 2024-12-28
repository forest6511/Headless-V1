package com.headblog.backend.infra.security

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    @Value("\${cors.allowed-origins}") private val allowedOrigins: String,
    private val jwtAuthenticationFilter: JwtAuthenticationFilter
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { cors -> cors.configurationSource(corsConfigurationSource()) }
            .csrf { csrf -> csrf.disable() }
            .formLogin { formLogin -> formLogin.disable() }
            .httpBasic { httpBasic -> httpBasic.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers(HttpMethod.POST, "/api/admin/auth/signup").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/admin/auth/signin").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()
                    // GET, POST, PUT, DELETEは認証必須
                    .requestMatchers(HttpMethod.GET, "/api/admin/**").authenticated()
                    .requestMatchers(HttpMethod.PUT, "/api/admin/**").authenticated()
                    .requestMatchers(HttpMethod.POST, "/api/admin/**").authenticated()
                    .requestMatchers(HttpMethod.DELETE, "/api/admin/**").authenticated()
                    .anyRequest().denyAll()
            }
            // JWTを使用した認証を、通常のユーザー名・パスワード認証
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
            // 認証系のエラーハンドリング
            .exceptionHandling { ex ->
                ex.authenticationEntryPoint { request, response, exception ->

                    val logger = LoggerFactory.getLogger("SecurityExceptionHandler")
                    logger.error("========================================================")
                    logger.error("Authentication error occurred", exception)
                    logger.error("Exception method: ${request.method}")
                    logger.error("Exception type: ${exception.javaClass.name}")
                    logger.error("Exception message: ${exception.message}")
                    logger.error("========================================================")

                    response.status = HttpStatus.UNAUTHORIZED.value()
                    response.contentType = "application/json"
                    response.writer.write(
                        ObjectMapper().writeValueAsString(
                            mapOf("error" to (exception.message ?: "Unauthorized"))
                        )
                    )
                }
            }
        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val originsList = allowedOrigins.split(",").map { it.trim() }

        val corsConfiguration = CorsConfiguration().apply {
            allowedOrigins = originsList
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH")
            allowedHeaders = listOf("*")
            allowCredentials = true
            exposedHeaders = listOf("Set-Cookie")
        }
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", corsConfiguration)
        return source
    }
}
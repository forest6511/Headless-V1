package com.headblog.backend.infra.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.headblog.backend.shared.exception.AppConflictException
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class ExceptionHandlerFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            filterChain.doFilter(request, response)
        } catch (ex: Exception) {
            val cause = when (ex) {
                // ServletException の場合、元の原因を取得（オリジナルの例外を取得)
                is ServletException -> {
                    ex.cause ?: ex
                }
                else -> {
                    ex
                }
            }

            val (status, message) = when (cause) {
                is AppConflictException -> {
                    HttpStatus.CONFLICT to cause.message
                }
                else -> {
                    logger.error("Original exception message: ${cause.message}")
                    logger.error("HTTP Status: ${HttpStatus.INTERNAL_SERVER_ERROR}")
                    HttpStatus.INTERNAL_SERVER_ERROR to "Internal Server Error"
                }
            }

            response.status = status.value()
            response.contentType = "application/json"
            response.writer.write(
                ObjectMapper().writeValueAsString(mapOf("error" to (message ?: "Unknown error")))
            )
        }
    }
}
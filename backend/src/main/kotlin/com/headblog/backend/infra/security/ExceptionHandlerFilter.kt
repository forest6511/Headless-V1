package com.headblog.backend.infra.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.headblog.backend.shared.exception.AppConflictException
import com.headblog.backend.shared.exception.DomainConflictException
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
            handleException(ex, response)
        }
    }

    private fun handleException(ex: Exception, response: HttpServletResponse) {
        // ServletException の場合、元の原因を取得（オリジナルの例外を取得)
        val cause = if (ex is ServletException && ex.cause != null) {
            ex.cause
        } else {
            ex
        }

        val (status, message) = when (cause) {
            is AppConflictException, is DomainConflictException -> {
                HttpStatus.CONFLICT to (cause.message ?: "Conflict error")
            }

            else -> {
                logError(cause)
                HttpStatus.INTERNAL_SERVER_ERROR to "Internal Server Error"
            }
        }

        writeErrorResponse(response, status, message)
    }

    private fun logError(cause: Throwable?) {
        logger.error("Exception occurred: ${cause?.message}", cause)
    }

    private fun writeErrorResponse(response: HttpServletResponse, status: HttpStatus, message: String?) {
        response.status = status.value()
        response.contentType = "application/json"
        response.writer.write(
            ObjectMapper().writeValueAsString(
                mapOf("error" to (message ?: "Unknown error"))
            )
        )
    }
}
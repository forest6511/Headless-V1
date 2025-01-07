package com.headblog.backend.infra.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.headblog.backend.shared.exception.AppConflictException
import com.headblog.backend.shared.exception.AuthException
import com.headblog.backend.shared.exception.DomainConflictException
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class ExceptionHandlerFilter : OncePerRequestFilter() {

    private val appLog = LoggerFactory.getLogger(ExceptionHandlerFilter::class.java)
    private val characterEncoding = Charsets.UTF_8

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
        val cause = (ex as? ServletException)?.cause ?: ex

        logOriginalErrorIfPresent(cause)

        val (status: HttpStatus, message) = when (cause) {
            is AuthException -> {
                HttpStatus.UNAUTHORIZED to (cause.message ?: "Unauthorized error")
            }
            is AppConflictException, is DomainConflictException -> {
                HttpStatus.CONFLICT to (cause.message ?: "Conflict error")
            }
            else -> {
                appLog.error("Unhandled exception occurred: ${cause.message}", cause)
                HttpStatus.INTERNAL_SERVER_ERROR to "Internal Server Error"
            }
        }
        writeErrorResponse(response, status, message)
    }

    private fun logOriginalErrorIfPresent(cause: Throwable?) {
        when (val originalCause = cause?.cause) {
            null -> appLog.error("Exception occurred: ${cause?.message}", cause)
            else -> appLog.error("Original exception occurred: ${originalCause.message}", originalCause)
        }
    }

    private fun writeErrorResponse(response: HttpServletResponse, status: HttpStatus, message: String?) {
        response.status = status.value()
        response.contentType = "application/json;charset=${characterEncoding}"
        response.characterEncoding = characterEncoding.name()
        response.writer.write(
            ObjectMapper().writeValueAsString(
                mapOf("error" to (message ?: "Unknown error"))
            )
        )
    }
}

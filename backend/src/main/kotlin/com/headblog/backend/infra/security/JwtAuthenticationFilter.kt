package com.headblog.backend.infra.security

import com.headblog.backend.app.service.UserAuthenticationService
import com.headblog.backend.domain.model.auth.JwtToken
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val userAuthenticationService: UserAuthenticationService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        logger.info("entering jwt authentication filter")

        extractToken(request)?.let {
            logger.info("token extracted from request: $it")
            val jwtToken = JwtToken.of(it)

            try {
                val userDetails = userAuthenticationService.getUserFromToken(jwtToken)
                logger.info("user authenticated: ${userDetails.email.value}")

                val authentication = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                )
                SecurityContextHolder.getContext().authentication = authentication
            } catch (e: Exception) {
                logger.error("error during token validation: ${e.message}", e)
            }
        } ?: run {
            logger.warn("no valid token found in the request")
        }

        filterChain.doFilter(request, response)
    }

    private fun extractToken(request: HttpServletRequest): String? {
        logger.info("extracting token from request: ${request.requestURL}")
        return request.getHeader("Authorization")
            ?.takeIf { it.startsWith("Bearer ") }
            ?.substring(7)
            .also {
                if (it == null) {
                    logger.warn("authorization header missing or invalid format in request: ${request.requestURL}")
                }
            }
    }
}

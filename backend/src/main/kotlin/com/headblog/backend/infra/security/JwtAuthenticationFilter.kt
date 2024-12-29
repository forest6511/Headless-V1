package com.headblog.backend.infra.security

import com.headblog.backend.domain.model.auth.JwtToken
import com.headblog.backend.infra.service.auth.UserAuthenticationService
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
        logger.debug("entering jwt authentication filter")

        logRequestDetails(request)

        extractToken(request)?.let {
            logger.debug("token extracted from request: $it")
            val jwtToken = JwtToken.of(it)

            try {
                val userDetails = userAuthenticationService.getUserFromToken(jwtToken)
                logger.debug("user authenticated: ${userDetails.email.value}")

                val authentication = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                )
                SecurityContextHolder.getContext().authentication = authentication
            } catch (e: Exception) {
                logger.error("error during token validation: ${e.message}")
            }
        } ?: run {
            logger.warn("no valid token found in the request")
        }

        filterChain.doFilter(request, response)
    }

    private fun extractToken(request: HttpServletRequest): String? {
        logger.debug("extracting token from request: ${request.requestURL}")
        return request.getHeader("Authorization")
            ?.takeIf { it.startsWith("Bearer ") }
            ?.substring(7)
            .also {
                if (it == null) {
                    logger.warn("authorization header missing or invalid format in request: ${request.requestURL}")
                }
            }
    }

    private fun logRequestDetails(request: HttpServletRequest) {
        logger.debug("===================================================")
        logger.debug("request method: ${request.method}")
        logger.debug("request URI: ${request.requestURI}")
        logger.debug("request URL: ${request.requestURL}")
        logger.debug("request headers:")
        request.headerNames.asIterator().forEachRemaining { headerName ->
            logger.debug("  $headerName: ${request.getHeader(headerName)}")
        }
        logger.debug("request parameters:")
        request.parameterNames.asIterator().forEachRemaining { paramName ->
            logger.debug("  $paramName: ${request.getParameter(paramName)}")
        }
        logger.debug("request remote address: ${request.remoteAddr}")
        logger.debug("===================================================")
    }
}
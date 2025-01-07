package com.headblog.backend.shared.exception

class AuthException(
    message: String,
    cause: Throwable? = null
) : RuntimeException(message, cause)
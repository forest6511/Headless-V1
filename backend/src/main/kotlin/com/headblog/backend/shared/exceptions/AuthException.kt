package com.headblog.backend.shared.exceptions

class AuthException(
    message: String,
    cause: Throwable? = null
) : RuntimeException(message, cause)
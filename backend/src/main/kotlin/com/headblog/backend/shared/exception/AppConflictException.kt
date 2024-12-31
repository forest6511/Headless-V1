package com.headblog.backend.shared.exception

class AppConflictException(
    message: String,
    cause: Throwable? = null
) : RuntimeException(message, cause)
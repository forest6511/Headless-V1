package com.headblog.backend.shared.exceptions

class AppConflictException(
    message: String,
    cause: Throwable? = null
) : RuntimeException(message, cause)
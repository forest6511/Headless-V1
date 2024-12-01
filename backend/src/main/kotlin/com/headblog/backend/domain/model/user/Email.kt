package com.headblog.backend.domain.model.user

@JvmInline
value class Email private constructor(val value: String) {
    companion object {
        private val EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$".toRegex()
        fun of(email: String): Email {
            require(email.matches(EMAIL_REGEX)) { "Invalid email format" }
            return Email(email.lowercase())
        }
    }
}
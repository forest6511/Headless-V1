package com.headblog.backend.domain.model.category

@JvmInline
value class Slug private constructor(val value: String) {
    companion object {
        const val DEFAULT_SLUG = "nosetting"
        private val SLUG_REGEX = "^[a-z0-9-_]+$".toRegex()

        fun of(slug: String): Slug {
            require(slug.matches(SLUG_REGEX)) { "Invalid slug format: $slug" }
            return Slug(slug)
        }
    }
}
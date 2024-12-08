package com.headblog.backend.domain.model.taxonomy

enum class TaxonomyType {
    CATEGORY,
    TAG;

    companion object {
        fun of(value: String): TaxonomyType {
            return entries.find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("Invalid TaxonomyType: $value")
        }
    }
}
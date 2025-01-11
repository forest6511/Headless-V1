package com.headblog.backend.domain.model.category

data class Translation(
    val language: Language,
    val name: String,
    val description: String?
)

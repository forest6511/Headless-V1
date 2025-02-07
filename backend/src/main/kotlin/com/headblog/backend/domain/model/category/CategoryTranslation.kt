package com.headblog.backend.domain.model.category

import com.headblog.backend.domain.model.common.Language

data class CategoryTranslation(
    val language: Language,
    val name: String,
    val description: String?
)

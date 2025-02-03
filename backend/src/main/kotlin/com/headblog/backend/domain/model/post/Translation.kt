package com.headblog.backend.domain.model.post

import com.headblog.backend.domain.model.common.Language

data class Translation(
    val language: Language,
    val status: Status,
    val title: String,
    val excerpt: String,
    val content: String
)
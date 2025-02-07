package com.headblog.backend.domain.model.media

import com.headblog.backend.domain.model.common.Language

data class MediaTranslation(
    val language: Language,
    val title: String,
)

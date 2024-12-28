package com.headblog.backend.app.usecase.tag.query

import java.util.*

data class TagDto(
    val id: UUID,
    val name: String,
    val slug: String,
)
package com.headblog.backend.app.usecase.translation

data class TranslationOptions(
    val style: TranslationStyle = TranslationStyle.PROFESSIONAL_AND_NATURAL,
    val tone: TranslationTone = TranslationTone.CONSISTENT_WITH_ORIGINAL
)
package com.headblog.backend.shared.id.domain

interface IdGenerator<T> {
    fun generate(): T
}
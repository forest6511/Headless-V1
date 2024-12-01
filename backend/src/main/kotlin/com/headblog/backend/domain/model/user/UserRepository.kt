package com.headblog.backend.domain.model.user

interface UserRepository {
    fun save(user: User): User
    fun findByEmail(email: Email): User?
}
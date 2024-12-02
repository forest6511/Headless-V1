package com.headblog.backend.infra.repository.user

import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserId
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.infra.jooq.tables.references.USERS
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class UserRepositoryImpl(
    private val dsl: DSLContext
) : UserRepository {

    override fun save(user: User): User {
        dsl.insertInto(USERS)
            .set(USERS.ID, user.id.value)
            .set(USERS.EMAIL, user.email.value)
            .set(USERS.PASSWORD_HASH, user.passwordHash.value)
            .set(USERS.ROLE, user.role.name)
            .set(USERS.CREATED_AT, user.createdAt)
            .set(USERS.UPDATED_AT, user.updatedAt)
            .execute()
        return user
    }

    override fun findByEmail(email: Email): User? {
        val result = dsl.selectFrom(USERS)
            .where(USERS.EMAIL.eq(email.value))
            // TODO add condition enable=true. changing the default value to 'FALSE'.
            .fetchOne()

        return result?.into(User::class.java)
    }

    override fun findById(userId: UserId): User? {
        val result = dsl.selectFrom(USERS)
            .where(USERS.ID.eq(userId.value))
            // TODO add condition enable=true. changing the default value to 'FALSE'.
            .fetchOne()

        return result?.into(User::class.java)
    }
}

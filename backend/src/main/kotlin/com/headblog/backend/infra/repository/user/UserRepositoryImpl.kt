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
            .set(USERS.ENABLED, user.enable)
            .set(USERS.NICKNAME, user.nickname)
            .set(USERS.THUMBNAIL_URL, user.thumbnailUrl)
            .set(USERS.LANGUAGE, user.language.value)
            .set(USERS.CREATED_AT, user.createdAt)
            .set(USERS.UPDATED_AT, user.updatedAt)
            .execute()
        return user
    }

    override fun findByEmail(email: Email): User? {
        val result = dsl.selectFrom(USERS)
            .where(USERS.EMAIL.eq(email.value))
            .and(USERS.ENABLED.eq(true))
            .fetchOne()
        return result?.into(User::class.java)
    }

    override fun findByNickname(nickName: String): User? {
        val result = dsl.selectFrom(USERS)
            .where(USERS.NICKNAME.eq(nickName))
            .fetchOne()
        return result?.into(User::class.java)
    }

    override fun findById(userId: UserId): User? {
        val result = dsl.selectFrom(USERS)
            .where(USERS.ID.eq(userId.value))
            .and(USERS.ENABLED.eq(true))
            .fetchOne()
        return result?.into(User::class.java)
    }
}

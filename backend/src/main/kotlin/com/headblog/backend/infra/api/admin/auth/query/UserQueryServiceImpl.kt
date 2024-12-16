package com.headblog.backend.infra.api.admin.auth.query

import com.headblog.backend.app.usecase.auth.query.GetUserQueryService
import com.headblog.backend.app.usecase.auth.query.UserDto
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.UserId
import com.headblog.infra.jooq.tables.Users.Companion.USERS
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Service

@Service
class UserQueryServiceImpl(
    private val dsl: DSLContext
) : GetUserQueryService {

    override suspend fun findByEmail(email: Email): UserDto? = withContext(Dispatchers.IO) {
        dsl.select()
            .from(USERS)
            .where(USERS.EMAIL.eq(email.value))
            .fetchOne()
            ?.toDto()
    }

    override suspend fun findById(id: UserId): UserDto? = withContext(Dispatchers.IO) {
        dsl.select()
            .from(USERS)
            .where(USERS.ID.eq(id.value))
            .fetchOne()
            ?.toDto()
    }

    /**
     * TODO HELP
     * Add jOOQ-kotlin extension methods to help ignore nullability when mapping
     * https://github.com/jOOQ/jOOQ/issues/12934
     */
    private fun Record.toDto(): UserDto {
        return UserDto(
            id = UserId(get(USERS.ID)!!),
            email = get(USERS.EMAIL)!!,
            role = get(USERS.ROLE)!!,
            createdAt = get(USERS.CREATED_AT)!!,
            updatedAt = get(USERS.UPDATED_AT)!!
        )
    }
}
package com.headblog.backend.shared.id.domain

import com.github.f4b6a3.uuid.UuidCreator
import org.springframework.stereotype.Component

@Component
class UuidV7Generator : IdGenerator<EntityId> {
    override fun generate(): EntityId {
        val uuid = UuidCreator.getTimeOrderedEpoch()
        return EntityIdImpl(uuid)
    }
}
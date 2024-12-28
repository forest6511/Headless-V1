package com.headblog.backend.domain.model.tag

import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.util.*

class Tag private constructor(
    val id: TagId,
    val name: String,
    val slug: String
) {
    companion object {
        private fun validate(name: String) {
            require(name.trim().startsWith("#")) { "Tag must start with '#' and not be empty. Found: '$name'" }
            require(name.trim().length > 1) { "Tag must have at least one character after '#'. Found: '$name'" }
        }

        private fun createInstance(
            id: TagId,
            name: String
        ): Tag {
            val trimmedName = name.trim()
            validate(trimmedName)
            val slug = trimmedName.substringAfter("#")
            return Tag(id, trimmedName, slug)
        }

        fun create(
            id: IdGenerator<EntityId>,
            name: String
        ): Tag {
            return createInstance(
                id = TagId(id.generate().value),
                name = name
            )
        }

        fun fromDto(
            id: UUID,
            name: String,
        ): Tag {
            return createInstance(
                id = TagId(id),
                name = name
            )
        }
    }
}

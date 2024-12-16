package com.headblog.backend.app.usecase.category.command.create

import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryId
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.shared.exception.AppConflictException
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CreateCategoryService(
    private val categoryRepository: CategoryRepository,
    private val idGenerator: IdGenerator<EntityId>
) : CreateCategoryUseCase {

    private val logger = LoggerFactory.getLogger(CreateCategoryService::class.java)

    override fun execute(command: CreateCategoryCommand): CategoryId {
        categoryRepository.findBySlug(command.slug)?.let {
            val message = "The taxonomy with slug '${command.slug}' already exists."
            logger.error(message)
            throw AppConflictException(message)
        }

        // ドメインの集約メソッドを呼び出してタクソノミーを作成
        val category = Category.create(
            id = idGenerator,
            name = command.name,
            slug = command.slug,
            description = command.description,
            parentId = command.parentId
        )
        categoryRepository.save(category)

        return category.id
    }
}


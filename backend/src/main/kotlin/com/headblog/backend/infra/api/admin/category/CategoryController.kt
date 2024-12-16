package com.headblog.backend.infra.api.admin.category

import com.headblog.backend.app.usecase.category.command.create.CreateCategoryCommand
import com.headblog.backend.app.usecase.category.command.create.CreateCategoryUseCase
import com.headblog.backend.app.usecase.category.command.delete.DeleteCategoryCommand
import com.headblog.backend.app.usecase.category.command.delete.DeleteCategoryUseCase
import com.headblog.backend.app.usecase.category.command.update.UpdateCategoryCommand
import com.headblog.backend.app.usecase.category.command.update.UpdateCategoryUseCase
import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryListDto
import com.headblog.backend.app.usecase.category.query.GetCategoryQueryService
import com.headblog.backend.infra.api.admin.category.request.CreateCategoryRequest
import com.headblog.backend.infra.api.admin.category.request.DeleteCategoryRequest
import com.headblog.backend.infra.api.admin.category.request.UpdateCategoryRequest
import java.util.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/categories")
class CategoryController(
    private val createCategoryUseCase: CreateCategoryUseCase,
    private val updateCategoryUseCase: UpdateCategoryUseCase,
    private val deleteCategoryUseCase: DeleteCategoryUseCase,
    private val getCategoryQueryService: GetCategoryQueryService
) {

    @PostMapping("/category")
    fun createCategory(@RequestBody request: CreateCategoryRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val categoryId = createCategoryUseCase.execute(command)
        return ResponseEntity.ok(categoryId.value)
    }

    @PutMapping("/category")
    fun updateCategory(@RequestBody request: UpdateCategoryRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val categoryId = updateCategoryUseCase.execute(command)
        return ResponseEntity.ok(categoryId.value)
    }

    @DeleteMapping("/category")
    fun deleteCategory(@RequestBody request: DeleteCategoryRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val categoryId = deleteCategoryUseCase.execute(command)
        return ResponseEntity.ok(categoryId.value)
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): ResponseEntity<CategoryDto> =
        getCategoryQueryService.findById(id)?.let { ResponseEntity.notFound().build() }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/categories")
    fun getByCategories(): ResponseEntity<List<CategoryListDto>> =
        ResponseEntity.ok(getCategoryQueryService.findCategoryList())

    // toCommand メソッド
    private fun CreateCategoryRequest.toCommand(): CreateCategoryCommand {
        return CreateCategoryCommand(
            name = this.name,
            slug = this.slug,
            description = this.description,
            parentId = this.parentId
        )
    }

    private fun UpdateCategoryRequest.toCommand(): UpdateCategoryCommand {
        return UpdateCategoryCommand(
            id = this.id,
            name = this.name,
            slug = this.slug,
            description = this.description,
            parentId = this.parentId
        )
    }

    private fun DeleteCategoryRequest.toCommand(): DeleteCategoryCommand {
        return DeleteCategoryCommand(
            id = this.id
        )
    }
}

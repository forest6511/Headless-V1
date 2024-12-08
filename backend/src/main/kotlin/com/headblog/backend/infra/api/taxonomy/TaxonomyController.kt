package com.headblog.backend.infra.api.taxonomy

import com.headblog.backend.app.usecase.taxonomy.command.create.CreateTaxonomyCommand
import com.headblog.backend.app.usecase.taxonomy.command.create.CreateTaxonomyUseCase
import com.headblog.backend.app.usecase.taxonomy.command.delete.DeleteTaxonomyCommand
import com.headblog.backend.app.usecase.taxonomy.command.delete.DeleteTaxonomyUseCase
import com.headblog.backend.app.usecase.taxonomy.command.update.UpdateTaxonomyCommand
import com.headblog.backend.app.usecase.taxonomy.command.update.UpdateTaxonomyUseCase
import com.headblog.backend.app.usecase.taxonomy.query.GetTaxonomyQueryService
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyWithPostRefsDto
import com.headblog.backend.domain.model.taxonomy.TaxonomyType
import com.headblog.backend.infra.api.taxonomy.request.CreateTaxonomyRequest
import com.headblog.backend.infra.api.taxonomy.request.DeleteTaxonomyRequest
import com.headblog.backend.infra.api.taxonomy.request.UpdateTaxonomyRequest
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
@RequestMapping("/api/taxonomies")
class TaxonomyController(
    private val createTaxonomyUseCase: CreateTaxonomyUseCase,
    private val updateTaxonomyUseCase: UpdateTaxonomyUseCase,
    private val deleteTaxonomyUseCase: DeleteTaxonomyUseCase,
    private val getTaxonomyQueryService: GetTaxonomyQueryService
) {

    @PostMapping("/category")
    fun createCategory(@RequestBody request: CreateTaxonomyRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val taxonomyId = createTaxonomyUseCase.execute(command)
        return ResponseEntity.ok(taxonomyId.value)
    }

    @PutMapping("/category")
    fun updateCategory(@RequestBody request: UpdateTaxonomyRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val taxonomyId = updateTaxonomyUseCase.execute(command)
        return ResponseEntity.ok(taxonomyId.value)
    }

    @DeleteMapping("/category")
    fun deleteCategory(@RequestBody request: DeleteTaxonomyRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val taxonomyId = deleteTaxonomyUseCase.execute(command)
        return ResponseEntity.ok(taxonomyId.value)
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): ResponseEntity<TaxonomyDto> =
        getTaxonomyQueryService.findById(id)?.let { ResponseEntity.notFound().build() }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/categories")
    fun getByCategories(): ResponseEntity<List<TaxonomyWithPostRefsDto>> =
        ResponseEntity.ok(getTaxonomyQueryService.findTypeWithPostRefs(TaxonomyType.CATEGORY))

    // toCommand メソッド
    private fun CreateTaxonomyRequest.toCommand(): CreateTaxonomyCommand {
        return CreateTaxonomyCommand(
            name = this.name,
            taxonomyType = this.type,
            slug = this.slug,
            description = this.description,
            parentId = this.parentId
        )
    }

    private fun UpdateTaxonomyRequest.toCommand(): UpdateTaxonomyCommand {
        return UpdateTaxonomyCommand(
            id = this.id,
            name = this.name,
            taxonomyType = this.type,
            slug = this.slug,
            description = this.description,
            parentId = this.parentId
        )
    }

    private fun DeleteTaxonomyRequest.toCommand(): DeleteTaxonomyCommand {
        return DeleteTaxonomyCommand(
            id = this.id
        )
    }
}

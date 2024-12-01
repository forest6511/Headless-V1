package com.headblog.backend.infra.api.taxonomy

import com.headblog.backend.app.usecase.taxonomy.command.CreateTaxonomyCommand
import com.headblog.backend.app.usecase.taxonomy.command.CreateTaxonomyUseCase
import com.headblog.backend.app.usecase.taxonomy.query.GetTaxonomyQueryService
import com.headblog.backend.app.usecase.taxonomy.query.TaxonomyDto
import com.headblog.backend.domain.model.taxonomy.TaxonomyId
import com.headblog.backend.infra.api.taxonomy.request.CreateTaxonomyRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/taxonomies")
class TaxonomyController(
    private val createTaxonomyUseCase: CreateTaxonomyUseCase,
    private val getTaxonomyQueryService: GetTaxonomyQueryService
) {

    @PostMapping
    suspend fun create(@RequestBody request: CreateTaxonomyRequest): ResponseEntity<UUID> {
        val command = request.toCommand()
        val taxonomyId = createTaxonomyUseCase.execute(command)
        return ResponseEntity.ok(taxonomyId.value)
    }

    @GetMapping("/{id}")
    suspend fun getById(@PathVariable id: UUID): ResponseEntity<TaxonomyDto> =
        getTaxonomyQueryService.findById(TaxonomyId(id))?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    // toCommand メソッド
    private fun CreateTaxonomyRequest.toCommand(): CreateTaxonomyCommand {
        return CreateTaxonomyCommand(
            name = this.name,
            taxonomyType = this.type,
            slug = this.slug,
            description = this.description,
            parentId = this.parentId?.let { TaxonomyId(it) }
        )
    }
}

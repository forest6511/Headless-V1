package com.headblog.backend.infra.api.client.category

import com.headblog.backend.app.usecase.category.query.GetClientCategoryQueryService
import com.headblog.backend.infra.api.client.category.response.HierarchicalCategoryResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/client/categories")
class ClientCategoryController(
    private val getClientCategoryQueryService: GetClientCategoryQueryService
) {
    @GetMapping
    fun getCategories(
        @RequestParam language: String
    ): ResponseEntity<List<HierarchicalCategoryResponse>> {
        val categories = getClientCategoryQueryService.getHierarchicalCategories(language)
        return ResponseEntity.ok(categories)
    }
}
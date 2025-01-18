package com.headblog.backend.infra.api.client.category

import com.headblog.backend.app.usecase.category.query.GetClientCategoryArticlesQueryService
import com.headblog.backend.app.usecase.category.query.GetClientCategoryQueryService
import com.headblog.backend.infra.api.client.category.response.CategoryWithArticlesClientResponse
import com.headblog.backend.infra.api.client.category.response.HierarchicalCategoryResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/client/categories")
class ClientCategoryController(
    private val getClientCategoryQueryService: GetClientCategoryQueryService,
    private val getClientCategoryArticlesQueryService: GetClientCategoryArticlesQueryService
) {
    @GetMapping
    fun getCategories(
        @RequestParam language: String
    ): ResponseEntity<List<HierarchicalCategoryResponse>> {
        val categories = getClientCategoryQueryService.getHierarchicalCategories(language)
        return ResponseEntity.ok(categories)
    }

    @GetMapping("/{firstSlug}")
    fun getCategoryArticles(
        @PathVariable firstSlug: String,
        @RequestParam language: String,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<CategoryWithArticlesClientResponse> {

        // categoryPathはすでにit/programmingのような形式で渡される
        val result = getClientCategoryArticlesQueryService.getCategoryArticles(
            firstSlug,
            language,
            pageSize
        )
        return ResponseEntity.ok(result)
    }

    @GetMapping("/{firstSlug}/{secondSlug}")
    fun getCategoryArticles(
        @PathVariable firstSlug: String,
        @PathVariable secondSlug: String,
        @RequestParam language: String,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<CategoryWithArticlesClientResponse> {

        // categoryPathはすでにit/programmingのような形式で渡される
        val result = getClientCategoryArticlesQueryService.getCategoryArticles(
            "$firstSlug/$secondSlug",
            language,
            pageSize
        )
        return ResponseEntity.ok(result)
    }
}
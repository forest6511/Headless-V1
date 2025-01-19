package com.headblog.backend.infra.api.client.tag

import com.headblog.backend.app.usecase.tag.query.GetClientTagArticlesQueryService
import com.headblog.backend.infra.api.client.tag.response.TagClientResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/client/tags")
class ClientTagController(
    private val getClientTagQueryService: GetClientTagArticlesQueryService
) {

    @GetMapping("/{name}")
    fun getCategoryArticles(
        @PathVariable name: String,
        @RequestParam language: String,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<TagClientResponse> {

        val result = getClientTagQueryService.getTagArticles(
            "#$name",
            language,
            pageSize
        )
        return ResponseEntity.ok(result)
    }
}
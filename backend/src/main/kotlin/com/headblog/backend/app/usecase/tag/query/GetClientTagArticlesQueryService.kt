package com.headblog.backend.app.usecase.tag.query

import com.headblog.backend.infra.api.client.tag.response.TagClientResponse

interface GetClientTagArticlesQueryService {
    fun getTagArticles(
        name: String,
        language: String,
        pageSize: Int
    ): TagClientResponse
}
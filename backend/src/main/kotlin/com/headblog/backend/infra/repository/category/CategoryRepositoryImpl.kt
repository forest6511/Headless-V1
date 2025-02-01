package com.headblog.backend.infra.repository.category

import com.headblog.backend.app.usecase.category.query.CategoryDto
import com.headblog.backend.app.usecase.category.query.CategoryWithPostIdsDto
import com.headblog.backend.app.usecase.post.query.FeaturedImageDto
import com.headblog.backend.app.usecase.post.query.PostDto
import com.headblog.backend.app.usecase.post.query.TranslationDto
import com.headblog.backend.app.usecase.tag.query.TagDto
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.post.Status
import com.headblog.infra.jooq.tables.references.CATEGORIES
import com.headblog.infra.jooq.tables.references.CATEGORY_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.MEDIAS
import com.headblog.infra.jooq.tables.references.MEDIA_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.POSTS
import com.headblog.infra.jooq.tables.references.POST_CATEGORIES
import com.headblog.infra.jooq.tables.references.POST_TAGS
import com.headblog.infra.jooq.tables.references.POST_TRANSLATIONS
import com.headblog.infra.jooq.tables.references.TAGS
import java.util.*
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository
import com.headblog.backend.app.usecase.category.query.TranslationDto as CategoryTranslationDto
import com.headblog.backend.app.usecase.media.query.TranslationDto as MediaTranslationDto


@Repository
class CategoryRepositoryImpl(
    private val dsl: DSLContext
) : CategoryRepository {
    override fun save(category: Category): Int {
        val categoryResult = dsl.insertInto(CATEGORIES)
            .set(CATEGORIES.ID, category.id.value)
            .set(CATEGORIES.SLUG, category.slug.value)
            .set(CATEGORIES.PARENT_ID, category.parentId?.value)
            .execute()

        category.translations.forEach { translation ->
            dsl.insertInto(CATEGORY_TRANSLATIONS)
                .set(CATEGORY_TRANSLATIONS.CATEGORY_ID, category.id.value)
                .set(CATEGORY_TRANSLATIONS.LANGUAGE, translation.language.value)
                .set(CATEGORY_TRANSLATIONS.NAME, translation.name)
                .set(CATEGORY_TRANSLATIONS.DESCRIPTION, translation.description)
                .execute()
        }

        return categoryResult
    }

    override fun update(category: Category): Int {
        val categoryResult = dsl.update(CATEGORIES)
            .set(CATEGORIES.SLUG, category.slug.value)
            .set(CATEGORIES.PARENT_ID, category.parentId?.value)
            .where(CATEGORIES.ID.eq(category.id.value))
            .execute()

        // 既存の翻訳を削除（選択された言語のみ）
        dsl.deleteFrom(CATEGORY_TRANSLATIONS)
            .where(
                CATEGORY_TRANSLATIONS.CATEGORY_ID.eq(category.id.value)
                    .and(CATEGORY_TRANSLATIONS.LANGUAGE.eq(category.translations.first().language.value))
            )
            .execute()

        category.translations.forEach { translation ->
            dsl.insertInto(CATEGORY_TRANSLATIONS)
                .set(CATEGORY_TRANSLATIONS.CATEGORY_ID, category.id.value)
                .set(CATEGORY_TRANSLATIONS.LANGUAGE, translation.language.value)
                .set(CATEGORY_TRANSLATIONS.NAME, translation.name)
                .set(CATEGORY_TRANSLATIONS.DESCRIPTION, translation.description)
                .execute()
        }

        return categoryResult
    }

    override fun delete(category: Category): Int {
        dsl.deleteFrom(CATEGORY_TRANSLATIONS)
            .where(CATEGORY_TRANSLATIONS.CATEGORY_ID.eq(category.id.value))
            .execute()

        return dsl.deleteFrom(CATEGORIES)
            .where(CATEGORIES.ID.eq(category.id.value))
            .execute()
    }

    override fun updateParentId(oldParentId: UUID, newParentId: UUID): Int {
        return dsl.update(CATEGORIES)
            .set(CATEGORIES.PARENT_ID, newParentId)
            .where(CATEGORIES.PARENT_ID.eq(oldParentId))
            .execute()
    }

    override fun findById(id: UUID): CategoryDto? = dsl.select()
        .from(CATEGORIES)
        .leftJoin(CATEGORY_TRANSLATIONS)
        .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
        .where(CATEGORIES.ID.eq(id))
        .fetch()
        .groupBy { it[CATEGORIES.ID] }
        .values
        .firstOrNull()
        ?.toCategoryDto()

    override fun findBySlug(slug: String): CategoryDto? = dsl.select()
        .from(CATEGORIES)
        .leftJoin(CATEGORY_TRANSLATIONS)
        .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
        .where(CATEGORIES.SLUG.eq(slug))
        .fetch()
        .groupBy { it[CATEGORIES.ID] }
        .values
        .firstOrNull()
        ?.toCategoryDto()

    override fun existsByParentId(parentId: UUID): Boolean {
        val count = dsl.selectCount()
            .from(CATEGORIES)
            .where(CATEGORIES.PARENT_ID.eq(parentId))
            .fetchOne(0, Int::class.java)
        return (count ?: 0) > 0
    }

    override fun findWithPostIds(): List<CategoryWithPostIdsDto> {
        return dsl.select()
            .from(CATEGORIES)
            .leftJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .leftJoin(POST_CATEGORIES)
            .on(CATEGORIES.ID.eq(POST_CATEGORIES.CATEGORY_ID))
            .fetch()
            .groupBy { it[CATEGORIES.ID] }
            .map { (_, records) -> records.toCategoryWithPostIdsDto() }
    }

    override fun findAllByParentId(parentId: UUID): List<CategoryDto> {
        return dsl.select()
            .from(CATEGORIES)
            .where(CATEGORIES.PARENT_ID.eq(parentId))
            .fetchInto(CategoryDto::class.java)
    }

    override fun findByIdAndLanguage(id: UUID, language: String): CategoryDto? {
        return dsl.select()
            .from(CATEGORIES)
            .innerJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .where(CATEGORIES.ID.eq(id))
            .and(CATEGORY_TRANSLATIONS.LANGUAGE.eq(language))
            .fetchOne()
            ?.let { record ->
                CategoryDto(
                    id = requireNotNull(record[CATEGORIES.ID]),
                    slug = requireNotNull(record[CATEGORIES.SLUG]),
                    parentId = record[CATEGORIES.PARENT_ID],
                    translations = listOf(
                        CategoryTranslationDto(
                            language = language,
                            name = requireNotNull(record[CATEGORY_TRANSLATIONS.NAME]),
                            description = record[CATEGORY_TRANSLATIONS.DESCRIPTION],
                            createdAt = requireNotNull(record[CATEGORY_TRANSLATIONS.CREATED_AT]),
                            updatedAt = requireNotNull(record[CATEGORY_TRANSLATIONS.UPDATED_AT])
                        )
                    ),
                    createdAt = requireNotNull(record[CATEGORIES.CREATED_AT]),
                    updatedAt = requireNotNull(record[CATEGORIES.UPDATED_AT])
                )
            }
    }

    override fun findAll(): List<CategoryDto> {
        return dsl.select()
            .from(CATEGORIES)
            .leftJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .fetch()
            .groupBy { it[CATEGORIES.ID] }
            .values
            .map { it.toCategoryDto() }
    }

    override fun findPublishedPostsByCategorySlug(
        slug: String,
        language: String,
        pageSize: Int
    ): List<PostDto> {
        val query = dsl.select(
            POSTS.asterisk(),
            POST_CATEGORIES.CATEGORY_ID,
            POST_TRANSLATIONS.LANGUAGE,
            POST_TRANSLATIONS.STATUS,
            POST_TRANSLATIONS.TITLE,
            POST_TRANSLATIONS.EXCERPT,
            MEDIAS.asterisk(),
            MEDIA_TRANSLATIONS.LANGUAGE,
            MEDIA_TRANSLATIONS.TITLE
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .innerJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))
            .innerJoin(CATEGORIES).on(POST_CATEGORIES.CATEGORY_ID.eq(CATEGORIES.ID))
            .leftJoin(MEDIAS).on(POSTS.FEATURED_IMAGE_ID.eq(MEDIAS.ID))
            .leftJoin(MEDIA_TRANSLATIONS).on(MEDIAS.ID.eq(MEDIA_TRANSLATIONS.MEDIA_ID))
            .where(CATEGORIES.SLUG.eq(slug))
            .and(POST_TRANSLATIONS.LANGUAGE.eq(language))
            .and(POST_TRANSLATIONS.STATUS.eq(Status.PUBLISHED.name))
            .orderBy(POSTS.CREATED_AT.desc())
            .limit(pageSize)

        return query.fetch().map { record ->
            val featuredImageId = record.get(POSTS.FEATURED_IMAGE_ID)
            val featuredImage = if (featuredImageId != null && record.get(MEDIAS.ID) != null) {
                FeaturedImageDto(
                    id = featuredImageId,
                    thumbnailUrl = requireNotNull(record.get(MEDIAS.THUMBNAIL_URL)),
                    mediumUrl = requireNotNull(record.get(MEDIAS.MEDIUM_URL)),
                    translations = listOf(
                        MediaTranslationDto(
                            language = requireNotNull(record.get(MEDIA_TRANSLATIONS.LANGUAGE)),
                            title = requireNotNull(record.get(MEDIA_TRANSLATIONS.TITLE))
                        )
                    )
                )
            } else null

            PostDto(
                id = requireNotNull(record.get(POSTS.ID)),
                slug = requireNotNull(record.get(POSTS.SLUG)),
                featuredImageId = featuredImageId,
                featuredImage = featuredImage,
                categoryId = requireNotNull(record.get(POST_CATEGORIES.CATEGORY_ID)),
                tags = fetchTagsForPost(record.get(POSTS.ID)!!),
                translations = listOf(
                    TranslationDto(
                        language = language,
                        status = requireNotNull(record.get(POST_TRANSLATIONS.STATUS)),
                        title = requireNotNull(record.get(POST_TRANSLATIONS.TITLE)),
                        excerpt = requireNotNull(record.get(POST_TRANSLATIONS.EXCERPT)),
                        content = "" // 記事一覧なのでcontentは不要
                    )
                ),
                createdAt = requireNotNull(record.get(POSTS.CREATED_AT)),
                updatedAt = requireNotNull(record.get(POSTS.UPDATED_AT))
            )
        }
    }

    override fun findPublishedPostsByParentCategorySlug(
        parentSlug: String,
        language: String,
        pageSize: Int
    ): List<PostDto> {
        // 親カテゴリとその子カテゴリのIDを取得するサブクエリ
        val categoryIds = dsl.select(CATEGORIES.ID)
            .from(CATEGORIES)
            .where(CATEGORIES.SLUG.eq(parentSlug))
            // 親カテゴリを親に持つ子カテゴリを取得
            .unionAll(
                dsl.select(CATEGORIES.ID)
                    .from(CATEGORIES)
                    .where(
                        CATEGORIES.PARENT_ID.eq(
                            dsl.select(CATEGORIES.ID)
                                .from(CATEGORIES)
                                .where(CATEGORIES.SLUG.eq(parentSlug))
                        )
                    )
            )

        // 記事を取得するメインクエリ
        val query = dsl.select(
            POSTS.asterisk(),
            POST_CATEGORIES.CATEGORY_ID,
            POST_TRANSLATIONS.LANGUAGE,
            POST_TRANSLATIONS.STATUS,
            POST_TRANSLATIONS.TITLE,
            POST_TRANSLATIONS.EXCERPT,
            MEDIAS.asterisk(),
            MEDIA_TRANSLATIONS.LANGUAGE,
            MEDIA_TRANSLATIONS.TITLE
        )
            .from(POSTS)
            .innerJoin(POST_CATEGORIES).on(POSTS.ID.eq(POST_CATEGORIES.POST_ID))
            .innerJoin(POST_TRANSLATIONS).on(POSTS.ID.eq(POST_TRANSLATIONS.POST_ID))
            .leftJoin(MEDIAS).on(POSTS.FEATURED_IMAGE_ID.eq(MEDIAS.ID))
            .leftJoin(MEDIA_TRANSLATIONS).on(MEDIAS.ID.eq(MEDIA_TRANSLATIONS.MEDIA_ID))
            .where(POST_CATEGORIES.CATEGORY_ID.`in`(categoryIds))
            .and(POST_TRANSLATIONS.LANGUAGE.eq(language))
            .and(POST_TRANSLATIONS.STATUS.eq(Status.PUBLISHED.name))
            .orderBy(POSTS.CREATED_AT.desc())
            .limit(pageSize)

        return query.fetch().map { record ->
            val featuredImageId = record.get(POSTS.FEATURED_IMAGE_ID)
            val featuredImage = if (featuredImageId != null && record.get(MEDIAS.ID) != null) {
                FeaturedImageDto(
                    id = featuredImageId,
                    thumbnailUrl = requireNotNull(record.get(MEDIAS.THUMBNAIL_URL)),
                    mediumUrl = requireNotNull(record.get(MEDIAS.MEDIUM_URL)),
                    translations = listOf(
                        MediaTranslationDto(
                            language = requireNotNull(record.get(MEDIA_TRANSLATIONS.LANGUAGE)),
                            title = requireNotNull(record.get(MEDIA_TRANSLATIONS.TITLE))
                        )
                    )
                )
            } else null

            PostDto(
                id = requireNotNull(record.get(POSTS.ID)),
                slug = requireNotNull(record.get(POSTS.SLUG)),
                featuredImageId = featuredImageId,
                featuredImage = featuredImage,
                categoryId = requireNotNull(record.get(POST_CATEGORIES.CATEGORY_ID)),
                tags = fetchTagsForPost(record.get(POSTS.ID)!!),
                translations = listOf(
                    TranslationDto(
                        language = language,
                        status = requireNotNull(record.get(POST_TRANSLATIONS.STATUS)),
                        title = requireNotNull(record.get(POST_TRANSLATIONS.TITLE)),
                        excerpt = requireNotNull(record.get(POST_TRANSLATIONS.EXCERPT)),
                        content = "" // 記事一覧なのでcontentは不要
                    )
                ),
                createdAt = requireNotNull(record.get(POSTS.CREATED_AT)),
                updatedAt = requireNotNull(record.get(POSTS.UPDATED_AT))
            )
        }
    }

    override fun findCategoryByPath(slugs: List<String>, language: String): CategoryDto? {
        // 最後のスラッグ（対象のカテゴリ）を取得
        val lastSlug = slugs.last()

        // 単一カテゴリの場合（スラッグが1つ）
        return if (slugs.size == 1) {
            findSingleCategory(lastSlug, language)
        } else {
            findHierarchicalCategory(slugs, lastSlug, language)
        }
    }

    // 単一カテゴリを検索するプライベートメソッド
    private fun findSingleCategory(slug: String, language: String): CategoryDto? {
        return dsl.select()
            .from(CATEGORIES)
            .innerJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .where(CATEGORIES.SLUG.eq(slug))
            .and(CATEGORY_TRANSLATIONS.LANGUAGE.eq(language))
            .fetchOne()
            ?.toCategoryDto(language)
    }

    // 階層的カテゴリを検索するプライベートメソッド
    private fun findHierarchicalCategory(slugs: List<String>, lastSlug: String, language: String): CategoryDto? {
        return dsl.select()
            .from(CATEGORIES)
            .innerJoin(CATEGORY_TRANSLATIONS)
            .on(CATEGORIES.ID.eq(CATEGORY_TRANSLATIONS.CATEGORY_ID))
            .where(CATEGORIES.SLUG.eq(lastSlug))
            .and(CATEGORY_TRANSLATIONS.LANGUAGE.eq(language))
            .and(
                CATEGORIES.PARENT_ID.eq(
                    dsl.select(CATEGORIES.ID)
                        .from(CATEGORIES)
                        .where(CATEGORIES.SLUG.eq(slugs[0]))
                )
            )
            .fetchOne()
            ?.toCategoryDto(language)
    }

    // レコードをCategoryDtoに変換する拡張関数
    private fun Record.toCategoryDto(language: String): CategoryDto {
        return CategoryDto(
            id = requireNotNull(this[CATEGORIES.ID]),
            slug = requireNotNull(this[CATEGORIES.SLUG]),
            parentId = this[CATEGORIES.PARENT_ID],
            translations = listOf(
                CategoryTranslationDto(
                    language = language,
                    name = requireNotNull(this[CATEGORY_TRANSLATIONS.NAME]),
                    description = this[CATEGORY_TRANSLATIONS.DESCRIPTION],
                    createdAt = requireNotNull(this[CATEGORY_TRANSLATIONS.CREATED_AT]),
                    updatedAt = requireNotNull(this[CATEGORY_TRANSLATIONS.UPDATED_AT])
                )
            ),
            createdAt = requireNotNull(this[CATEGORIES.CREATED_AT]),
            updatedAt = requireNotNull(this[CATEGORIES.UPDATED_AT])
        )
    }

    private fun fetchTagsForPost(postId: UUID): List<TagDto> {
        return dsl.select(TAGS.ID, TAGS.NAME, TAGS.SLUG)
            .from(TAGS)
            .join(POST_TAGS).on(TAGS.ID.eq(POST_TAGS.TAG_ID))
            .where(POST_TAGS.POST_ID.eq(postId))
            .fetch()
            .map { it.toTagDto() }
    }

    private fun Record.toTagDto(): TagDto {
        return TagDto(
            id = requireNotNull(get(TAGS.ID)),
            name = requireNotNull(get(TAGS.NAME)),
            slug = requireNotNull(get(TAGS.SLUG)),
        )
    }

    private fun List<Record>.toCategoryDto(): CategoryDto {
        val firstRecord = first()
        return CategoryDto(
            id = requireNotNull(firstRecord[CATEGORIES.ID]),
            slug = requireNotNull(firstRecord[CATEGORIES.SLUG]),
            parentId = firstRecord[CATEGORIES.PARENT_ID],
            translations = map {
                CategoryTranslationDto(
                    language = requireNotNull(it[CATEGORY_TRANSLATIONS.LANGUAGE]),
                    name = requireNotNull(it[CATEGORY_TRANSLATIONS.NAME]),
                    description = it[CATEGORY_TRANSLATIONS.DESCRIPTION],
                    createdAt = requireNotNull(it[CATEGORY_TRANSLATIONS.CREATED_AT]),
                    updatedAt = requireNotNull(it[CATEGORY_TRANSLATIONS.UPDATED_AT])
                )
            },
            createdAt = requireNotNull(firstRecord[CATEGORIES.CREATED_AT]),
            updatedAt = requireNotNull(firstRecord[CATEGORIES.UPDATED_AT])
        )
    }

    private fun List<Record>.toCategoryWithPostIdsDto(): CategoryWithPostIdsDto {
        val firstRecord = first()
        return CategoryWithPostIdsDto(
            id = requireNotNull(firstRecord[CATEGORIES.ID]),
            slug = requireNotNull(firstRecord[CATEGORIES.SLUG]),
            parentId = firstRecord[CATEGORIES.PARENT_ID],
            translations = map {
                CategoryTranslationDto(
                    language = requireNotNull(it[CATEGORY_TRANSLATIONS.LANGUAGE]),
                    name = requireNotNull(it[CATEGORY_TRANSLATIONS.NAME]),
                    description = it[CATEGORY_TRANSLATIONS.DESCRIPTION],
                    createdAt = requireNotNull(it[CATEGORY_TRANSLATIONS.CREATED_AT]),
                    updatedAt = requireNotNull(it[CATEGORY_TRANSLATIONS.UPDATED_AT])
                )
            },
            createdAt = requireNotNull(firstRecord[CATEGORIES.CREATED_AT]),
            updatedAt = requireNotNull(firstRecord[CATEGORIES.UPDATED_AT]),
            postIds = mapNotNull { it[POST_CATEGORIES.POST_ID] }
                .distinct()
                .ifEmpty { emptyList() }
        )
    }
}
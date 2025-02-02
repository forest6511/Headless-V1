package com.headblog.backend.app.usecase.post.command.update

import com.headblog.backend.app.usecase.post.admin.update.UpdatePostCommand
import com.headblog.backend.app.usecase.post.admin.update.UpdatePostService
import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.post.Language
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.admin.PostRepository
import com.headblog.backend.domain.model.post.Status
import com.headblog.backend.domain.model.post.Translation
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional
import com.headblog.backend.domain.model.category.Language as CategoryLanguage
import com.headblog.backend.domain.model.category.Translation as CategoryTranslation

@SpringBootTest
@Transactional
class UpdatePostServiceTest {
    @Autowired
    lateinit var categoryRepository: CategoryRepository

    @Autowired
    lateinit var postCategoryRepository: PostCategoryRepository

    @Autowired
    private lateinit var updatePostService: UpdatePostService

    @Autowired
    private lateinit var postRepository: PostRepository

    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>

    @Test
    @DisplayName("スラッグの衝突がない場合に投稿が正常に更新されること")
    fun `should update post successfully when no slug conflict exists`() {
        // GIVEN
        val category = createCategory("test-category", listOf(createTranslation("ja", "開発")))
        categoryRepository.save(category)

        val originalPost = createAndSavePost("元のタイトル", "original-slug", category)

        val command = UpdatePostCommand(
            id = originalPost.id.value,
            language = "ja",
            title = "更新後のタイトル",
            content = "更新後のコンテンツ",
            status = "PUBLISHED",
            featuredImageId = null,
            categoryId = category.id.value,
            tagNames = emptySet(),
            slug = "update-slug",
            excerpt = "更新後の要約"
        )

        // WHEN
        val postId = updatePostService.execute(command).value

        // THEN
        val updatedPost = postRepository.findById(postId)
        assertNotNull(updatedPost)
        assertEquals("update-slug", checkNotNull(updatedPost).slug)
        val updatedTranslation = updatedPost.translations.first()
        assertEquals("更新後のタイトル", updatedTranslation.title)
        assertEquals("更新後の要約", updatedTranslation.excerpt)
    }

    @Test
    @DisplayName("新規タグが投稿に追加されること")
    fun `should add new tags to post`() {
        // GIVEN
        val category = createCategory("tag-category", listOf(createTranslation("ja", "タグカテゴリ")))
        categoryRepository.save(category)

        val originalPost = createAndSavePost("タグなしタイトル", "no-tags-slug", category)

        val newTagNames = setOf("#Kotlin", "#Java", "#SpringBoot")
        val command = UpdatePostCommand(
            id = originalPost.id.value,
            language = "ja",
            title = "タグ付きタイトル",
            content = "タグ付きコンテンツ",
            status = "PUBLISHED",
            featuredImageId = null,
            categoryId = category.id.value,
            tagNames = newTagNames,
            slug = "test-tag-slug",
            excerpt = "要約"
        )

        // WHEN
        val postId = updatePostService.execute(command).value

        // THEN
        val updatedPost = postRepository.findById(postId)
        assertNotNull(updatedPost)

        val updatedTags = updatedPost!!.tags
        assertEquals(newTagNames.size, updatedTags.size)

        val updatedTagNames = updatedTags.map { it.name }.toSet()
        newTagNames.forEach { newTagName ->
            assertTrue(updatedTagNames.contains(newTagName), "Tag $newTagName should be present.")
        }
    }

    private fun createAndSavePost(title: String, slug: String, category: Category): Post {
        val post = Post.create(
            id = idGenerator,
            slug = slug,
            featuredImageId = null,
            categoryId = category.id.value,
            translations = listOf(
                Translation(
                    language = Language.of("ja"),
                    status = Status.of(Status.PUBLISHED.name),
                    title = title,
                    excerpt = "サンプル概要",
                    content = "サンプルコンテンツ"
                )
            )
        )
        postRepository.save(post)
        postCategoryRepository.addRelation(post.id, category.id)
        return post
    }

    private fun createCategory(
        slug: String,
        translations: List<CategoryTranslation>
    ): Category = Category.create(idGenerator, slug, null, translations)

    private fun createTranslation(
        language: String,
        name: String,
        description: String? = null
    ): CategoryTranslation = CategoryTranslation(CategoryLanguage.of(language), name, description)
}
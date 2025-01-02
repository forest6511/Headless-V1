package com.headblog.backend.app.usecase.post.command.update

import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.post.Language
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.domain.model.post.PostTranslation
import com.headblog.backend.domain.model.post.Status
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.util.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

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
        val category = createCategory("Development", "development")
        categoryRepository.save(category)

        val originalPost = createAndSavePost("Original Title", "original-slug", category)

        val command = UpdatePostCommand(
            id = originalPost.id.value,
            title = "Updated Title",
            slug = "updated-slug",
            content = "Updated content",
            excerpt = "Updated excerpt",
            status = "PUBLISHED",
            featuredImageId = null,
            categoryId = category.id.value,
            tagNames = emptySet(),
            language = "ja"
        )

        // WHEN
        val postId = updatePostService.execute(command).value

        // THEN
        val updatedPost = postRepository.findById(postId)
        assertNotNull(updatedPost)
        assertEquals("updated-slug", checkNotNull(updatedPost).slug)
        val updatedTranslation = updatedPost.translations.first()
        assertEquals("Updated Title", updatedTranslation.title)
    }

    @Test
    @DisplayName("新規タグが投稿に追加されること")
    fun `should add new tags to post`() {
        // GIVEN
        val category = createCategory("AddTagCategory", "addtag-category")
        categoryRepository.save(category)

        val originalPost = createAndSavePost("Title With No Tags", "no-tags-slug", category)

        // 新しいタグを追加
        val newTagNames = setOf("#Kotlin", "#Java", "#SpringBoot")
        val command = UpdatePostCommand(
            id = originalPost.id.value,
            title = "Title With Tags",
            slug = "tags-slug",
            content = "Updated content with tags",
            excerpt = "Tags excerpt",
            status = "PUBLISHED",
            featuredImageId = null,
            categoryId = category.id.value,
            tagNames = newTagNames,
            language = "ja"
        )

        // WHEN
        val postId = updatePostService.execute(command).value

        // THEN
        val updatedPost = postRepository.findById(postId)
        assertNotNull(updatedPost)

        // タグの検証
        val updatedTags = updatedPost!!.tags
        assertEquals(newTagNames.size, updatedTags.size)

        val updatedTagNames = updatedTags.map { it.name }.toSet()
        newTagNames.forEach { newTagName ->
            assertTrue(updatedTagNames.contains(newTagName), "Tag $newTagName should be present.")
        }
    }

    /**
     * 新規投稿を DB に保存し、カテゴリとのリレーションを作る
     */
    private fun createAndSavePost(title: String, slug: String, category: Category): Post {
        val post = Post.create(
            id = idGenerator,
            slug = slug,
            status = Status.PUBLISHED.name,
            featuredImageId = null,
            categoryId = category.id.value,
            translations = listOf(
                PostTranslation(
                    language = Language.of("ja"),
                    title = title,
                    excerpt = "Sample excerpt",
                    content = "Sample content"
                )
            )
        )
        postRepository.save(post)
        postCategoryRepository.addRelation(post.id, category.id)
        return post
    }

    private fun createCategory(name: String, slug: String, parentId: UUID? = null): Category =
        Category.create(
            idGenerator,
            name,
            slug,
            "Test description for $name",
            parentId
        )
}

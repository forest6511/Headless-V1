package com.headblog.backend.app.usecase.post.command.update

import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.CategoryRepository
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.domain.model.post.PostStatus
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.util.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
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
            postStatus = "PUBLISHED",
            featuredImageId = null,
            metaTitle = "Updated Meta Title",
            metaDescription = "Updated Meta Description",
            metaKeywords = "Updated Meta Keywords",
            ogTitle = "Updated OG Title",
            ogDescription = "Updated OG Description",
            categoryId = category.id.value
        )

        // WHEN
        val postId = updatePostService.execute(command).value

        // Then
        val updatedPost = postRepository.findById(postId)
        assertNotNull(updatedPost)
        assertEquals("Updated Title", updatedPost!!.title)
        assertEquals("updated-slug", updatedPost.slug)
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
            postStatus = "PUBLISHED",
            featuredImageId = null,
            metaTitle = "Meta Title",
            metaDescription = "Meta Description",
            metaKeywords = "Meta Keywords",
            ogTitle = "OG Title",
            ogDescription = "OG Description",
            categoryId = category.id.value,
            tagNames = newTagNames
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
            title = title,
            slug = slug,
            content = "Sample content",
            excerpt = "Sample excerpt",
            postStatus = PostStatus.PUBLISHED.name,
            featuredImageId = null,
            metaTitle = null,
            metaDescription = null,
            metaKeywords = null,
            ogTitle = null,
            ogDescription = null,
            categoryId = category.id.value
        )
        postRepository.save(post)
        postCategoryRepository.addRelation(post.id, category.id)
        return post
    }

    private fun createCategory(name: String, slug: String, parentId: UUID? = null): Category =
        Category.create(idGenerator, name, slug, "Test description for $name", parentId)
}
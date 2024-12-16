package com.headblog.backend.infra.repository.post

import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.domain.model.post.PostStatus
import com.headblog.backend.domain.model.post.PostTaxonomyRepository
import com.headblog.backend.domain.model.taxonomy.Taxonomy
import com.headblog.backend.domain.model.taxonomy.TaxonomyRepository
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.util.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class PostRepositoryImplTest {

    @Autowired
    lateinit var postRepository: PostRepository

    @Autowired
    lateinit var taxonomyRepository: TaxonomyRepository

    @Autowired
    lateinit var postTaxonomyRepository: PostTaxonomyRepository

    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>

    private lateinit var defaultTaxonomy: Taxonomy

    @BeforeEach
    fun setup() {
        // デフォルトのタクソノミーを作成
        defaultTaxonomy = createTaxonomy("Default Category", "default-category")
        taxonomyRepository.save(defaultTaxonomy)
    }

    @Test
    @DisplayName("最初のページを取得できる")
    fun `should get first page`() {
        // Given
        val pageSize = 5
        createMultiplePosts(10)

        // When
        val posts = postRepository.findAll(null, pageSize)

        // Then
        assertEquals(pageSize + 1, posts.size) // 次ページの存在確認用に1件多く取得

        // pageSizeが5件の場合は、1ページ目は6件取得するので、5件を検証
        val postsWithoutLastItem = posts.dropLast(1)

        // ID降順になっていることを確認 (UUID V7の確認)
        for (i in 0 until postsWithoutLastItem.size - 1) {
            val currentId = postsWithoutLastItem[i].id
            val nextId = postsWithoutLastItem[i + 1].id
            assertTrue(currentId > nextId, "ID should be in descending order")
        }

        assertEquals("Test Post 10", postsWithoutLastItem[0].title)
        assertEquals("Test Post 9", postsWithoutLastItem[1].title)
        assertEquals("Test Post 8", postsWithoutLastItem[2].title)
        assertEquals("Test Post 7", postsWithoutLastItem[3].title)
        assertEquals("Test Post 6", postsWithoutLastItem[4].title)
    }

    @Test
    @DisplayName("最後のページを取得できる")
    fun `should get last page`() {
        // Given
        val totalPosts = 13
        val pageSize = 5
        createMultiplePosts(totalPosts)

        // When
        val lastPage = generateSequence(
            // 初期値として最初のページを取得
            postRepository.findAll(null, pageSize)
        ) { previousPage ->
            // 6件目のデータがある場合（次のページが存在する）
            if (previousPage.size > pageSize) {
                // インデックス5（6件目）のIDをカーソルとして使用
                val cursorId = previousPage[pageSize - 1].id
                postRepository.findAll(cursorId, pageSize)
            } else {
                null
            }
        }.last() // 最後のページを取得

        // Then
        assertNotNull(lastPage)
        assertEquals(3, lastPage.size)
        assertEquals("Test Post 3", lastPage[0].title)
        assertEquals("Test Post 2", lastPage[1].title)
        assertEquals("Test Post 1", lastPage[2].title)
    }

    @Test
    @DisplayName("最後のページを取得できる - 割り切れる件数")
    fun `should get last page when total count is exactly divisible by page size`() {
        // Given
        val totalPosts = 10
        val pageSize = 5
        createMultiplePosts(totalPosts)

        // When
        val lastPage = generateSequence(
            postRepository.findAll(null, pageSize)
        ) { previousPage ->
            if (previousPage.size > pageSize) {
                val cursorId = previousPage[pageSize - 1].id
                postRepository.findAll(cursorId, pageSize)
            } else {
                null
            }
        }.last()

        // Then
        assertNotNull(lastPage)
        assertEquals(5, lastPage.size)  // 最後のページは5件
        // 降順で取得されることを確認
        assertEquals("Test Post 5", lastPage[0].title)
        assertEquals("Test Post 4", lastPage[1].title)
        assertEquals("Test Post 3", lastPage[2].title)
        assertEquals("Test Post 2", lastPage[3].title)
        assertEquals("Test Post 1", lastPage[4].title)
    }

    @Test
    @DisplayName("総件数を取得できる")
    fun `should get total count`() {
        // Given
        val totalPosts = 103
        createMultiplePosts(totalPosts)

        // When
        val count = postRepository.count()

        // Then
        assertEquals(totalPosts, count)
    }

    private fun createMultiplePosts(count: Int): List<Post> {
        return (1..count).map { i ->
            val post = Post.create(
                id = idGenerator,
                title = "Test Post $i",
                slug = "test-post-$i",
                content = "Content for test post $i",
                excerpt = "Excerpt for test post $i",
                postStatus = PostStatus.PUBLISHED.name,
                featuredImageId = null,
                metaTitle = null,
                metaDescription = null,
                metaKeywords = null,
                ogTitle = null,
                ogDescription = null,
                categoryId = defaultTaxonomy.id.value
            )
            postRepository.save(post)
            postTaxonomyRepository.addRelation(post.id, defaultTaxonomy.id)
            post
        }
    }

    private fun createTaxonomy(name: String, slug: String, parentId: UUID? = null): Taxonomy =
        Taxonomy.create(
            id = idGenerator,
            name = name,
            slug = slug,
            description = "Test description for $name",
            parentId = parentId
        )
}
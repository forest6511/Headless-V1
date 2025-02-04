package com.headblog.backend.infra.repository.post

import com.headblog.backend.domain.model.category.Category
import com.headblog.backend.domain.model.category.admin.CategoryRepository
import com.headblog.backend.domain.model.common.Language
import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.Status
import com.headblog.backend.domain.model.post.Translation
import com.headblog.backend.domain.model.post.admin.PostRepository
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional
import com.headblog.backend.domain.model.category.Translation as CategoryTranslation

@SpringBootTest
@Transactional
class PostRepositoryImplTest {
    @Autowired
    lateinit var postRepository: PostRepository

    @Autowired
    lateinit var categoryRepository: CategoryRepository

    @Autowired
    lateinit var postCategoryRepository: PostCategoryRepository

    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>

    private lateinit var defaultCategory: Category

    @BeforeEach
    fun setup() {
        defaultCategory = createCategory(
            "default-category",
            listOf(createCategoryTranslation("ja", "デフォルト"))
        )
        categoryRepository.save(defaultCategory)
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
        // 次ページが存在するか確認用に、pageSize+1件取得している
        assertEquals(pageSize + 1, posts.size)
        val postsWithoutLastItem = posts.dropLast(1)

        // ID降順 (UUID V7想定) になっていることを確認
        for (i in 0 until postsWithoutLastItem.size - 1) {
            val currentId = postsWithoutLastItem[i].id
            val nextId = postsWithoutLastItem[i + 1].id
            assertTrue(currentId > nextId)
        }

        assertEquals("記事 10", postsWithoutLastItem[0].translations.first().title)
        assertEquals("記事 9", postsWithoutLastItem[1].translations.first().title)
        assertEquals("記事 8", postsWithoutLastItem[2].translations.first().title)
        assertEquals("記事 7", postsWithoutLastItem[3].translations.first().title)
        assertEquals("記事 6", postsWithoutLastItem[4].translations.first().title)
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
            // 6件目のデータがある場合（= 次のページがある）
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
        // 初期登録データ1件を含む
        assertEquals(4, lastPage.size)
        assertEquals("記事 3", lastPage[0].translations.first().title)
        assertEquals("記事 2", lastPage[1].translations.first().title)
        assertEquals("記事 1", lastPage[2].translations.first().title)
    }

    @Test
    @DisplayName("最後のページを取得できる - 割り切れる件数")
    fun `should get last page when total count is exactly divisible by page size`() {
        // Given
        val totalPosts = 9 // 初期登録データを含めると10件
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
        // 最後のページはちょうど5件になるはず
        assertEquals(5, lastPage.size)
        // 降順で取得されることを確認
        assertEquals("記事 4", lastPage[0].translations.first().title)
        assertEquals("記事 3", lastPage[1].translations.first().title)
        assertEquals("記事 2", lastPage[2].translations.first().title)
        assertEquals("記事 1", lastPage[3].translations.first().title)
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
        assertEquals(totalPosts + 1, count) // 初期データ1件を含む
    }

    /**
     * 指定数の投稿をまとめて作成
     */
    private fun createMultiplePosts(count: Int): List<Post> {
        return (1..count).map { i ->
            val post = Post.create(
                id = idGenerator,
                slug = "test-post-$i",
                featuredImageId = null,
                categoryId = defaultCategory.id.value,
                translations = listOf(createTranslation("ja", Status.PUBLISHED.name, "記事 $i"))
            )
            postRepository.save(post)
            postCategoryRepository.addRelation(post.id, defaultCategory.id)
            post
        }
    }

    private fun createCategory(
        slug: String,
        translations: List<CategoryTranslation>
    ): Category = Category.create(idGenerator, slug, null, translations)

    private fun createCategoryTranslation(
        language: String,
        name: String,
        description: String? = null
    ): CategoryTranslation = CategoryTranslation(Language.of(language), name, description)

    private fun createTranslation(
        language: String,
        status: String,
        title: String,
        excerpt: String = "要約 $title",
        content: String = "本文 $title"
    ): Translation = Translation(Language.of(language), Status.of(status), title, excerpt, content)
}
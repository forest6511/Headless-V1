package com.headblog.backend.infra.repository.media

import com.headblog.backend.domain.model.common.Language
import com.headblog.backend.domain.model.media.Media
import com.headblog.backend.domain.model.media.MediaId
import com.headblog.backend.domain.model.media.MediaRepository
import com.headblog.backend.domain.model.media.MediaSize
import com.headblog.backend.domain.model.media.MediaTranslation
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserId
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.backend.domain.model.user.UserRole
import com.headblog.backend.shared.constants.LanguageConstants
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDateTime
import java.util.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class MediaRepositoryImplTest {

    @Autowired
    lateinit var mediaRepository: MediaRepository

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>

    @Autowired
    lateinit var passwordEncoder: PasswordEncoder

    private lateinit var defaultUser: UserId
    private lateinit var anotherUser: UserId

    @BeforeEach
    fun setup() {
        defaultUser = createUser().id
        anotherUser = createUser().id
    }

    @Test
    @DisplayName("最初のページを取得できる")
    fun `should get first page`() {
        // Given
        val pageSize = 5
        createMultipleMedias(10)

        // When
        val medias = mediaRepository.findAll(null, null, pageSize)

        // Then
        assertEquals(pageSize + 1, medias.size) // 次ページの存在確認用に1件多く取得

        val mediasWithoutLastItem = medias.dropLast(1)

        // ID降順になっていることを確認 (UUID V7の確認)
        for (i in 0 until mediasWithoutLastItem.size - 1) {
            val currentId = mediasWithoutLastItem[i].id
            val nextId = mediasWithoutLastItem[i + 1].id
            assertTrue(currentId > nextId, "ID should be in descending order")
        }

        mediasWithoutLastItem.forEachIndexed { index, media ->
            val mediaNumber = 10 - index
            assertEquals("test-$mediaNumber", media.title)
            assertEquals(2, media.translations.size)

            // 日本語の翻訳を確認
            assertTrue(media.translations.any { translation ->
                translation.language == LanguageConstants.JA &&
                        translation.title == "test-$mediaNumber"
            })

            // 英語の翻訳を確認
            assertTrue(media.translations.any { translation ->
                translation.language == LanguageConstants.EN &&
                        translation.title == "test-$mediaNumber"
            })
        }
    }

    @Test
    @DisplayName("特定のユーザーの画像のみを取得できる")
    fun `should get medias by specific user`() {
        // Given
        val pageSize = 5
        createMultipleMedias(3, defaultUser)
        createMultipleMedias(2, anotherUser)

        // When
        val medias = mediaRepository.findAll(null, defaultUser, pageSize)

        // Then
        assertEquals(3, medias.size)
        medias.forEach { media ->
            assertEquals(defaultUser.value, media.uploadedBy)
        }
    }

    @Test
    @DisplayName("最後のページを取得できる")
    fun `should get last page`() {
        // Given
        val totalMedias = 13
        val pageSize = 5
        createMultipleMedias(totalMedias)

        // When
        val lastPage = generateSequence(
            mediaRepository.findAll(null, null, pageSize)
        ) { previousPage ->
            if (previousPage.size > pageSize) {
                val cursorId = MediaId(previousPage[pageSize - 1].id)
                mediaRepository.findAll(cursorId, null, pageSize)
            } else {
                null
            }
        }.last()

        // Then
        assertNotNull(lastPage)
        assertEquals(3, lastPage.size)

        lastPage.forEachIndexed { index, media ->
            val mediaNumber = 3 - index
            assertEquals("test-$mediaNumber", media.title)
            assertEquals(2, media.translations.size)

            // 日本語の翻訳を確認
            assertTrue(media.translations.any { translation ->
                translation.language == LanguageConstants.JA &&
                        translation.title == "test-$mediaNumber"
            })

            // 英語の翻訳を確認
            assertTrue(media.translations.any { translation ->
                translation.language == LanguageConstants.EN &&
                        translation.title == "test-$mediaNumber"
            })
        }
    }

    @Test
    @DisplayName("総件数を取得できる")
    fun `should get total count`() {
        // Given
        val totalMedias = 7
        createMultipleMedias(totalMedias)

        // When
        val count = mediaRepository.count(null)

        // Then
        assertEquals(totalMedias, count)
    }

    @Test
    @DisplayName("ユーザーごとの総件数を取得できる")
    fun `should get total count by user`() {
        // Given
        val userMediaCount = 3
        createMultipleMedias(userMediaCount, defaultUser)
        createMultipleMedias(2, anotherUser)

        // When
        val count = mediaRepository.count(defaultUser)

        // Then
        assertEquals(userMediaCount, count)
    }

    private fun createUser(): User {
        val rand = UUID.randomUUID()
        return User.create(
            id = UserId(idGenerator.generate().value),
            email = "$rand@example.com",
            rawPassword = "test12345",
            passwordEncoder = passwordEncoder,
            role = UserRole.ADMIN,
            enable = true,
            nickname = "$rand-test-user",
            thumbnailUrl = "$rand-thumbnail.png",
            language = "ja",
            currentTime = LocalDateTime.now()
        ).let {
            userRepository.save(it)
        }
    }

    private fun createMultipleMedias(count: Int, userId: UserId = defaultUser): List<Media> {
        return (1..count).map { i ->
            val media = Media.create(
                idGenerator = idGenerator,
                uploadedBy = userId,
                thumbnail = MediaSize(
                    url = "thumbnail-$i.jpg",
                    size = 100 * i
                ),
                small = MediaSize(
                    url = "small-$i.jpg",
                    size = 800 * i
                ),
                large = MediaSize(
                    url = "large-$i.jpg",
                    size = 1200 * i
                ),
                translations = listOf(
                    MediaTranslation(
                        Language.of(LanguageConstants.JA),
                        "test-$i"
                    ),
                    MediaTranslation(
                        Language.of(LanguageConstants.EN),
                        "test-$i"
                    )
                )
            )
            mediaRepository.save(media)
            media
        }
    }
}
package com.headblog.backend.app.usecase.auth.command.signin

import com.headblog.backend.domain.model.user.Email
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class SignInServiceTest {

    @Autowired
    private lateinit var signInService: SignInService

    @Test
    @DisplayName("正しいメールアドレスとパスワードでサインインできる")
    fun `should sign in successfully with correct credentials`() {
        // Given
        val command = SignInCommand(
            email = "admin@example.com",
            password = "correct_password"
        )

        // When
        val result = signInService.execute(command)

        // Then
        assertNotNull(result)
        assertNotNull(result.authTokens.accessToken)
        assertEquals(Email.of("admin@example.com"), result.email)
    }

    @Test
    @DisplayName("誤ったパスワードでサインインを試みると失敗する")
    fun `should fail sign in with incorrect password`() {
        // Given
        val command = SignInCommand(
            email = "test@example.com",
            // test@example.comの正しいパスワードは'incorrect_password'
            password = "mistake_password"
        )

        // When / Then
        val exception = assertThrows(Exception::class.java) {
            signInService.execute(command)
        }
        assertEquals("invalid credentials for email: test@example.com", exception.message)
    }

    @Test
    @DisplayName("存在しないメールアドレスでサインインを試みると失敗する")
    fun `should fail sign in with non-existing email`() {
        // Given
        val command = SignInCommand(
            email = "nonexistent@example.com",
            password = "some_password"
        )

        // When / Then
        val exception = assertThrows(Exception::class.java) {
            signInService.execute(command)
        }
        assertEquals("invalid credentials for email: nonexistent@example.com", exception.message)
    }

    @Test
    @DisplayName("有効化されていないユーザーでサインインを試みると失敗する")
    fun `should fail sign in when user is not enabled`() {
        // Given
        val command = SignInCommand(
            email = "admin-enable-fale@example.com",
            password = "correct_password"
        )

        // When / Then
        val exception = assertThrows(Exception::class.java) {
            signInService.execute(command)
        }
        assertEquals("invalid credentials for email: admin-enable-fale@example.com", exception.message)
    }
}

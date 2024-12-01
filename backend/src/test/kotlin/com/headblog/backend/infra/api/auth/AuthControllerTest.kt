package com.headblog.backend.infra.api.auth

import com.headblog.backend.app.usecase.auth.command.signin.SignInRequest
import com.headblog.backend.domain.model.user.UserRole
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.security.test.context.support.WithMockUser

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    @DisplayName("正しいメールアドレスとパスワードでサインインできる")
    @WithMockUser(username = "admin@example.com", password = "correct_password", roles = ["ADMIN"])
    fun `should sign in successfully with correct credentials`() {
        val request = SignInRequest(
            email = "admin@example.com",
            password = "correct_password"
        )

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signin")
            .contentType("application/json")
            .content("""{"email": "${request.email}", "password": "${request.password}"}"""))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(request.email))
            .andExpect(MockMvcResultMatchers.jsonPath("$.role").value(UserRole.ADMIN.name))
            .andExpect(MockMvcResultMatchers.jsonPath("$.jwtResult.token").isNotEmpty)
    }

    @Test
    @DisplayName("誤ったパスワードでサインインを試みると失敗する")
    fun `should fail sign in with incorrect password`() {
        val request = SignInRequest(
            email = "test@example.com",
            password = "bad_password"
        )

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signin")
            .contentType("application/json")
            .content("""{"email": "${request.email}", "password": "${request.password}"}"""))
            .andExpect(status().isForbidden)
    }

    @Test
    @DisplayName("存在しないメールアドレスでサインインを試みると失敗する")
    fun `should fail sign in with non-existing email`() {
        val request = SignInRequest(
            email = "nonexistent@example.com",
            password = "some_password"
        )

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signin")
            .contentType("application/json")
            .content("""{"email": "${request.email}", "password": "${request.password}"}"""))
            .andExpect(status().isForbidden)
    }
}

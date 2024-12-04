package com.headblog.backend.infra.api.auth

import com.headblog.backend.infra.api.auth.request.SignInRequest
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

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

        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/signin")
                .contentType("application/json")
                .content("""{"email": "${request.email}", "password": "${request.password}"}""")
        )
            .andDo(MockMvcResultHandlers.print()) // リクエストとレスポンスを出力
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(request.email))
            .andExpect(MockMvcResultMatchers.jsonPath("$.authTokens.accessToken").isNotEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.authTokens.refreshToken").isNotEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.authTokens.expiresAt").isNotEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.authTokens.refreshExpiresAt").isNotEmpty)

    }

    @Test
    @DisplayName("誤ったパスワードでサインインを試みると失敗する")
    fun `should fail sign in with incorrect password`() {
        val request = SignInRequest(
            email = "test@example.com",
            password = "bad_password"
        )

        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/signin")
                .contentType("application/json")
                .content("""{"email": "${request.email}", "password": "${request.password}"}""")
        )
            .andExpect(status().isForbidden)
    }

    @Test
    @DisplayName("存在しないメールアドレスでサインインを試みると失敗する")
    fun `should fail sign in with non-existing email`() {
        val request = SignInRequest(
            email = "nonexistent@example.com",
            password = "some_password"
        )

        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/signin")
                .contentType("application/json")
                .content("""{"email": "${request.email}", "password": "${request.password}"}""")
        )
            .andExpect(status().isForbidden)
    }
}

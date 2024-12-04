package com.headblog.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class HeadBlogApplication

fun main(args: Array<String>) {
    runApplication<HeadBlogApplication>(*args)
}

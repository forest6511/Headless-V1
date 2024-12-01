package com.headblog.backend.domain.model.user

// TODO: Refactor or review this exception class for better handling and clarity in the future.
sealed class UserException(message: String) : RuntimeException(message)

class EmailAlreadyExistsException(email: String) :
    UserException("Email $email is already registered")

class InvalidCredentialsException :
    UserException("Invalid email or password")
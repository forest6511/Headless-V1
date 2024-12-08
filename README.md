# HeadBlog

![Build Status](https://github.com/forest6511/HeadBlog/actions/workflows/ci.yml/badge.svg) 

## Setup Instructions

### 1. Clone the Repository
Run the following command to clone the repository:
```bash
git clone https://github.com/yourusername/headblog.git
cd headblog
```

### 2. Start Docker Containers
Start the PostgreSQL and Redis services using Docker Compose:
```bash
docker compose up -d
```

### 3. Access PostgreSQL
Access the PostgreSQL container:
```bash
docker exec -it postgres_17_db_container psql -U postgres
```

### 4. Create the database and user:
```sql
CREATE USER headblog WITH PASSWORD 'headblog';
CREATE DATABASE headblog;
GRANT ALL PRIVILEGES ON DATABASE headblog TO headblog;

\c headblog
GRANT ALL PRIVILEGES ON SCHEMA public TO headblog;

CREATE DATABASE "headblog-test";
GRANT ALL PRIVILEGES ON DATABASE "headblog-test" TO headblog;

\c "headblog-test"
GRANT ALL PRIVILEGES ON SCHEMA public TO headblog;
```

### 5. Run the Application
After setting up the database, run the backend application using Gradle:
```bash
./gradlew bootRun
```

### 6. Start the Frontend Development Server
In a separate terminal, navigate to the frontend directory and start the Next.js development server:
```bash
cd frontend && npm run dev
```
---

## Signup and Signin API

To sign up a new user or sign in an existing user, use the following `curl` command. This will send a POST request to the backend API to create or authenticate a user and return access tokens.

### Request

For signup:
```bash
curl --location 'http://localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "<your_email>",
    "password" : "<password>"
}'
```

For signin:
```bash
curl --location 'http://localhost:8080/api/auth/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "<your_email>",
    "password" : "<password>"
}'
```

### Payload Example

Upon successful signup or signin, you will receive a response payload similar to the following:

```json
{
    "email": "<your_email>",
    "authTokens": {
        "accessToken": "<access_token>",
        "refreshToken": "<refresh_token>",
        "expiresAt": "2024-12-04T15:33:08.142+00:00",
        "refreshExpiresAt": "2024-12-04T15:34:08.142+00:00"
    }
}
```

### UUID Version 7

The `id` in the response payload is generated using **UUID Version 7**, which is a time-based UUID. UUID V7 can be generated using the [UUID Creator](https://github.com/f4b6a3/uuid-creator) library.

# HeadBlog

![Build Status](https://github.com/forest6511/HeadBlog/actions/workflows/ci.yml/badge.svg) 

**HeadBlog** is a blogging platform leveraging PostgreSQL as the database and Redis for caching. This project is designed for developers looking to quickly set up a scalable and efficient blogging environment using Docker Compose.


## Vercel Deployment

You can view the live project at the following URL:

- [Vercel Deployment](https://head-blog.vercel.app/admin)

---

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

## Signup API

To sign up a new user, you can use the following `curl` command. This will send a POST request to the backend API to create a new user.

### Request

```bash
curl --location 'http://localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=C5C8D0F5428AC01612C681BCB9F582A6' \
--data-raw '{
    "email": "<your_email>",
    "password" : "<password>"
}'
```

### Payload Example

Here is an example of the payload response you will receive upon successful signup:

```json
{
    "userId": {
        "value": "0193862e-08bf-7887-822e-177553c21c18"
    },
    "jwtResult": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTkzODYyZS0wOGJmLTc4ODctODIyZS0xNzc1NTNjMjFjMTgiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MzMxMjI5ODQsImV4cCI6MTczMzIwOTM4NH0.ZLUnXmIg-7mdn7Gmxp911j41XxC3X-OtMpg1KXsL47U",
        "expiresAt": "2024-12-03T07:03:04.234+00:00"
    }
}
```

### UUID Version 7

The `id` in the response payload is generated using **UUID Version 7**, which is a time-based UUID. UUID V7 can be generated using the [UUID Creator](https://github.com/f4b6a3/uuid-creator) library.

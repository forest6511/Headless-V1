# HeadBlog

**HeadBlog** is a blogging platform leveraging PostgreSQL as the database and Redis for caching. This project is designed for developers looking to quickly set up a scalable and efficient blogging environment using Docker Compose.

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
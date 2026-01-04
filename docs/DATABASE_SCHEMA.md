# Database Schema

## Overview

Entoo2 uses PostgreSQL 16 as the primary database. The schema follows these conventions:

- All tables use UUID primary keys
- Timestamps use `TIMESTAMP WITH TIME ZONE`
- Soft delete not implemented (hard delete with cascades)
- Czech language only (fields use `_cs` suffix for clarity)

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │  semesters   │       │   subjects   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │◄──────│ id (PK)      │
│ email        │       │ name_cs      │       │ semester_id  │
│ password_hash│       │ order_index  │       │ name_cs      │
│ role         │       │ created_at   │       │ description  │
│ display_name │       │ updated_at   │       │ credits      │
│ language     │       └──────────────┘       │ created_at   │
│ created_at   │                              │ updated_at   │
│ updated_at   │                              └──────────────┘
└──────────────┘
       │                                             │
       │    ┌────────────────────────────────────────┼────────────────────┐
       │    │                    │                   │                    │
       ▼    ▼                    ▼                   ▼                    ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐    ┌──────────────┐
│  favorites   │       │   comments   │       │  questions   │    │  documents   │
├──────────────┤       ├──────────────┤       ├──────────────┤    ├──────────────┤
│ user_id (PK) │       │ id (PK)      │       │ id (PK)      │    │ id (PK)      │
│ subject_id   │       │ subject_id   │       │ subject_id   │    │ subject_id   │
│ created_at   │       │ user_id      │       │ user_id      │    │ uploaded_by  │
└──────────────┘       │ content      │       │ title        │    │ filename     │
                       │ created_at   │       │ content      │    │ original_name│
┌──────────────┐       │ updated_at   │       │ is_answered  │    │ file_size    │
│subject_teachers      └──────────────┘       │ created_at   │    │ mime_type    │
├──────────────┤                              │ updated_at   │    │ minio_path   │
│ id (PK)      │                              └──────────────┘    │ content_text │
│ subject_id   │                                     │            │ created_at   │
│ teacher_name │                                     ▼            └──────────────┘
│ topic_cs     │                              ┌──────────────┐
│ created_at   │                              │   answers    │
└──────────────┘                              ├──────────────┤
                                              │ id (PK)      │
                                              │ question_id  │
                                              │ user_id      │
                                              │ content      │
                                              │ is_accepted  │
                                              │ created_at   │
                                              │ updated_at   │
                                              └──────────────┘
```

## Table Definitions

### users

Stores user account information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'admin')),
    display_name VARCHAR(100),
    language VARCHAR(2) NOT NULL DEFAULT 'cs'
        CHECK (language IN ('cs', 'en')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### semesters

Organizes subjects into academic periods.

```sql
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_cs VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_semesters_order ON semesters(order_index);
```

### subjects

Academic subjects within semesters.

```sql
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    name_cs VARCHAR(200) NOT NULL,
    description_cs TEXT,
    credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subjects_semester ON subjects(semester_id);
```

### subject_teachers

Teachers associated with subjects and their teaching topics.

```sql
CREATE TABLE subject_teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_name VARCHAR(200) NOT NULL,
    topic_cs VARCHAR(300),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subject_teachers_subject ON subject_teachers(subject_id);
```

### documents

Uploaded files associated with subjects.

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    mime_type VARCHAR(100) NOT NULL,
    minio_path VARCHAR(500) NOT NULL,
    content_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_subject ON documents(subject_id);
CREATE INDEX idx_documents_uploader ON documents(uploaded_by);
CREATE INDEX idx_documents_created ON documents(created_at DESC);
```

### comments

User comments on subjects.

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_subject ON comments(subject_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);
```

### questions

Q&A questions on subjects.

```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    is_answered BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_subject ON questions(subject_id);
CREATE INDEX idx_questions_user ON questions(user_id);
CREATE INDEX idx_questions_answered ON questions(is_answered);
CREATE INDEX idx_questions_created ON questions(created_at DESC);
```

### answers

Answers to questions.

```sql
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_answers_user ON answers(user_id);
CREATE INDEX idx_answers_accepted ON answers(is_accepted);
```

### favorites

User favorite subjects (junction table).

```sql
CREATE TABLE favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, subject_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_subject ON favorites(subject_id);
```

## Seed Data

### Initial Admin User

```sql
-- Password: changeme123 (bcrypt hash)
INSERT INTO users (email, password_hash, role, display_name, language)
VALUES (
    'admin@entoo2.local',
    '$2a$10$rQZ5pVxYJ8qVJxDwWJvZYOQYhJWmZKZJ1HJx0hJ5qJz8JzQz8JzQz',
    'admin',
    'Administrator',
    'cs'
);
```

### Example Semesters

```sql
INSERT INTO semesters (name_cs, name_en, order_index) VALUES
('1. semestr', '1st Semester', 1),
('2. semestr', '2nd Semester', 2),
('3. semestr', '3rd Semester', 3),
('4. semestr', '4th Semester', 4),
('5. semestr', '5th Semester', 5),
('6. semestr', '6th Semester', 6);
```

## Migrations

Migrations are managed using [golang-migrate](https://github.com/golang-migrate/migrate).

### Migration Files Location

```
entoo2-api/internal/database/migrations/
├── 000001_create_users.up.sql
├── 000001_create_users.down.sql
├── 000002_create_semesters.up.sql
├── 000002_create_semesters.down.sql
├── 000003_create_subjects.up.sql
├── 000003_create_subjects.down.sql
...
```

### Running Migrations

```bash
# Apply all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Check migration status
make migrate-status
```

## Indexes Summary

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| users | idx_users_email | email | Login lookups |
| users | idx_users_role | role | Admin filtering |
| semesters | idx_semesters_order | order_index | Ordered listing |
| subjects | idx_subjects_semester | semester_id | Filter by semester |
| documents | idx_documents_subject | subject_id | Documents per subject |
| documents | idx_documents_created | created_at DESC | Recent documents |
| comments | idx_comments_subject | subject_id | Comments per subject |
| questions | idx_questions_subject | subject_id | Questions per subject |
| questions | idx_questions_answered | is_answered | Filter unanswered |
| answers | idx_answers_question | question_id | Answers per question |
| favorites | idx_favorites_user | user_id | User's favorites |

## Backup & Restore

### Backup

```bash
# Full database backup
pg_dump -h localhost -U entoo2 -d entoo2 -F c -f backup.dump

# Data only (no schema)
pg_dump -h localhost -U entoo2 -d entoo2 --data-only -F c -f data.dump
```

### Restore

```bash
# Full restore
pg_restore -h localhost -U entoo2 -d entoo2 -c backup.dump

# Data only restore
pg_restore -h localhost -U entoo2 -d entoo2 --data-only data.dump
```

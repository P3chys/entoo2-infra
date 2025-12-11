# Entoo2 Project Context

## Project Overview

Entoo2 is a document-sharing web application for law students. Students can share lecture materials organized by subjects and semesters, search through documents, and engage with Q&A and comments.

## Repository Structure

This project is split across three repositories:

| Repository | Purpose | Technology |
|------------|---------|------------|
| `entoo2-infra` (this repo) | Infrastructure, Docker, docs | Docker, Traefik |
| `entoo2-api` | Backend REST API | Go, Gin, GORM |
| `entoo2-web` | Frontend application | SvelteKit, TypeScript |

## Technology Stack

- **Frontend:** SvelteKit 2.x, TypeScript, Tailwind CSS
- **Backend:** Go 1.22+, Gin, GORM
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **File Storage:** MinIO (S3-compatible)
- **Search:** Meilisearch
- **Content Extraction:** Apache Tika
- **Reverse Proxy:** Traefik 3

## Key Features

1. **Document Management:** Upload, download, search through PDF, DOCX, PPTX, etc.
2. **Subject Organization:** Subjects grouped by semesters with teacher info and credits
3. **Full-text Search:** Fuzzy search through document content
4. **User Engagement:** Comments, Q&A, favorites
5. **Internationalization:** Czech and English support
6. **Theme:** Dark/light mode with blueish accents

## Directory Structure (This Repo)

```
entoo2-infra/
├── docs/           # Project documentation
├── docker/         # Docker Compose files
├── config/         # Service configurations
├── scripts/        # Utility scripts
├── .github/        # GitHub Actions & templates
└── .claude/        # Claude Code configuration
```

## Common Tasks

### Start Infrastructure

```bash
docker compose -f docker/docker-compose.services.yml up -d
```

### Stop Infrastructure

```bash
docker compose -f docker/docker-compose.services.yml down
```

### View Logs

```bash
docker compose -f docker/docker-compose.services.yml logs -f [service_name]
```

### Reset All Data

```bash
docker compose -f docker/docker-compose.services.yml down -v
docker compose -f docker/docker-compose.services.yml up -d
```

## Service URLs (Development)

| Service | URL |
|---------|-----|
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |
| MinIO Console | http://localhost:9001 |
| Meilisearch | http://localhost:7700 |
| Tika | http://localhost:9998 |

## Database Schema Summary

Main tables:
- `users` - User accounts (student/admin roles)
- `semesters` - Academic periods
- `subjects` - Courses within semesters
- `subject_teachers` - Teachers per subject
- `documents` - Uploaded files
- `comments` - Subject comments
- `questions` / `answers` - Q&A
- `favorites` - User favorites

## API Design Patterns

- RESTful endpoints under `/api/v1`
- JWT authentication (access + refresh tokens)
- Standardized JSON responses
- Pagination for list endpoints
- Rate limiting per user

## Coding Conventions

### Go (Backend)

- Follow standard Go project layout
- Use GORM for database operations
- Structured logging with levels
- Error wrapping with context
- Test coverage for handlers

### TypeScript/Svelte (Frontend)

- Strict TypeScript mode
- Svelte stores for state management
- Tailwind for styling
- Component-first architecture
- E2E tests with Playwright

## Environment Variables

See `docker/.env.example` for all configuration options.

Key variables:
- `POSTGRES_*` - Database credentials
- `REDIS_PASSWORD` - Cache password
- `MINIO_*` - Storage credentials
- `MEILI_MASTER_KEY` - Search API key
- `JWT_SECRET` - Token signing secret

## Useful Commands

```bash
# Validate docker-compose
docker compose -f docker/docker-compose.yml config

# Check service health
docker compose -f docker/docker-compose.services.yml ps

# Connect to database
docker exec -it entoo2-postgres psql -U entoo2 -d entoo2

# Clear Redis cache
docker exec -it entoo2-redis redis-cli -a redis_dev FLUSHALL
```

## Related Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
- [REQUIREMENTS.md](docs/REQUIREMENTS.md) - Features and requirements
- [API_DESIGN.md](docs/API_DESIGN.md) - API specification
- [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - Database design
- [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) - UI/UX guidelines
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development setup

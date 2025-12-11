# Entoo2 Infrastructure

Infrastructure, documentation, and Docker configuration for the Entoo2 document-sharing platform.

## Overview

Entoo2 is a web application for law students to share lecture documents, organized by subjects and semesters. Students can upload, download, search through documents, and engage with Q&A and comments on each subject.

## Related Repositories

| Repository | Description | Stack |
|------------|-------------|-------|
| [entoo2-infra](https://github.com/P3chys/entoo2-infra) | Infrastructure & docs (this repo) | Docker, Traefik |
| [entoo2-api](https://github.com/P3chys/entoo2-api) | Backend API | Go, Gin |
| [entoo2-web](https://github.com/P3chys/entoo2-web) | Frontend application | SvelteKit |

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24+)
- [Git](https://git-scm.com/)

### 1. Clone and Setup

```bash
git clone https://github.com/P3chys/entoo2-infra.git
cd entoo2-infra

# Copy environment template
cp docker/.env.example docker/.env

# Edit .env with your settings (optional for development)
```

### 2. Start Infrastructure Services

```bash
# Start all infrastructure services (database, cache, storage, search)
docker compose -f docker/docker-compose.services.yml up -d

# Check services are running
docker compose -f docker/docker-compose.services.yml ps
```

### 3. Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Traefik Dashboard | http://localhost:8080 | - |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |
| Meilisearch | http://localhost:7700 | - |
| PostgreSQL | localhost:5432 | entoo2 / entoo2_dev |
| Redis | localhost:6379 | - |

## Architecture

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                        Traefik                          │
                    │                   (Reverse Proxy)                       │
                    │                    Port 80, 443                         │
                    └─────────────────────────────────────────────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
          │   entoo2-web    │       │   entoo2-api    │       │     MinIO       │
          │   (SvelteKit)   │       │    (Go/Gin)     │       │  (File Storage) │
          │    Port 3000    │       │    Port 8000    │       │   Port 9000     │
          └─────────────────┘       └─────────────────┘       └─────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
          │   PostgreSQL    │       │      Redis      │       │   Meilisearch   │
          │   (Database)    │       │     (Cache)     │       │    (Search)     │
          │    Port 5432    │       │    Port 6379    │       │    Port 7700    │
          └─────────────────┘       └─────────────────┘       └─────────────────┘
                                                                      │
                                                              ┌───────┴───────┐
                                                              ▼               │
                                                    ┌─────────────────┐       │
                                                    │   Apache Tika   │◄──────┘
                                                    │   (Extraction)  │
                                                    │    Port 9998    │
                                                    └─────────────────┘
```

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and design decisions |
| [REQUIREMENTS.md](docs/REQUIREMENTS.md) | Functional and non-functional requirements |
| [API_DESIGN.md](docs/API_DESIGN.md) | REST API specification |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Database tables and relationships |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | UI/UX design system and components |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md) | Local development setup guide |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide |

## Docker Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Full stack (all services + apps) |
| `docker-compose.dev.yml` | Development overrides |
| `docker-compose.services.yml` | Infrastructure services only |

## Tech Stack

- **Frontend:** SvelteKit, TypeScript, Tailwind CSS
- **Backend:** Go, Gin, GORM
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **File Storage:** MinIO (S3-compatible)
- **Search:** Meilisearch
- **Content Extraction:** Apache Tika
- **Reverse Proxy:** Traefik 3
- **CI/CD:** GitHub Actions

## License

MIT License - see [LICENSE](LICENSE) for details.

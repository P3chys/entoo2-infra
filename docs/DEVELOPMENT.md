# Development Guide

## Prerequisites

Before starting, ensure you have installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) v24+
- [Git](https://git-scm.com/) v2.40+
- [Go](https://golang.org/) v1.22+ (for backend development)
- [Node.js](https://nodejs.org/) v20+ (for frontend development)
- [pnpm](https://pnpm.io/) v8+ (recommended) or npm

Optional but recommended:
- [Make](https://gnuwin32.sourceforge.net/packages/make.htm) (Windows) / pre-installed (Mac/Linux)
- [GitHub CLI](https://cli.github.com/)
- [VS Code](https://code.visualstudio.com/) with recommended extensions

## Quick Start

### 1. Clone Repositories

```bash
# Clone all three repositories
git clone https://github.com/P3chys/entoo2-infra.git
git clone https://github.com/P3chys/entoo2-api.git
git clone https://github.com/P3chys/entoo2-web.git

# Or use GitHub CLI
gh repo clone P3chys/entoo2-infra
gh repo clone P3chys/entoo2-api
gh repo clone P3chys/entoo2-web
```

### 2. Start Infrastructure Services

```bash
cd entoo2-infra

# Copy environment file
cp docker/.env.example docker/.env

# Start infrastructure (database, cache, storage, search)
docker compose -f docker/docker-compose.services.yml up -d

# Verify services are running
docker compose -f docker/docker-compose.services.yml ps
```

### 3. Start Backend API

```bash
cd entoo2-api

# Copy environment file
cp .env.example .env

# Install dependencies
go mod download

# Run database migrations
make migrate-up

# Start development server with hot reload
make dev

# API will be available at http://localhost:8000
```

### 4. Start Frontend

```bash
cd entoo2-web

# Copy environment file
cp .env.example .env

# Install dependencies
pnpm install

# Start development server
pnpm dev

# App will be available at http://localhost:5173
```

## Environment Configuration

### Infrastructure (.env)

```bash
# docker/.env

# PostgreSQL
POSTGRES_USER=entoo2
POSTGRES_PASSWORD=entoo2_dev
POSTGRES_DB=entoo2

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

# Meilisearch
MEILI_MASTER_KEY=dev_master_key_change_in_production

# Redis
REDIS_PASSWORD=redis_dev
```

### Backend (.env)

```bash
# entoo2-api/.env

# Server
PORT=8000
GIN_MODE=debug

# Database
DATABASE_URL=postgres://entoo2:entoo2_dev@localhost:5432/entoo2?sslmode=disable

# Redis
REDIS_URL=redis://:redis_dev@localhost:6379/0

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=documents
MINIO_USE_SSL=false

# Meilisearch
MEILI_URL=http://localhost:7700
MEILI_API_KEY=dev_master_key_change_in_production

# Tika
TIKA_URL=http://localhost:9998

# JWT
JWT_SECRET=development_secret_change_in_production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=168h
```

### Frontend (.env)

```bash
# entoo2-web/.env

PUBLIC_API_URL=http://localhost:8000/api/v1
PUBLIC_APP_NAME=Entoo2
```

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | SvelteKit dev server |
| Backend API | http://localhost:8000 | Go API |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |
| MinIO Console | http://localhost:9001 | Storage UI |
| MinIO API | http://localhost:9000 | S3 API |
| Meilisearch | http://localhost:7700 | Search UI |
| Tika | http://localhost:9998 | Content extraction |
| Traefik | http://localhost:8080 | Proxy dashboard |

## Common Tasks

### Database Operations

```bash
# Run all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Create new migration
make migrate-create name=add_user_avatar

# Reset database (drop all, recreate, migrate)
make db-reset

# Connect to database
docker exec -it entoo2-postgres psql -U entoo2 -d entoo2
```

### Backend Development

```bash
# Run tests
make test

# Run tests with coverage
make test-coverage

# Run linter
make lint

# Format code
make fmt

# Build binary
make build

# Generate API docs (if using Swagger)
make docs
```

### Frontend Development

```bash
# Development server with HMR
pnpm dev

# Type checking
pnpm check

# Linting
pnpm lint

# Format code
pnpm format

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

### Docker Operations

```bash
# Start all infrastructure services
docker compose -f docker/docker-compose.services.yml up -d

# Stop all services
docker compose -f docker/docker-compose.services.yml down

# View logs
docker compose -f docker/docker-compose.services.yml logs -f

# View specific service logs
docker compose -f docker/docker-compose.services.yml logs -f postgres

# Rebuild and start
docker compose -f docker/docker-compose.services.yml up -d --build

# Remove all data (volumes)
docker compose -f docker/docker-compose.services.yml down -v
```

## VS Code Setup

### Recommended Extensions

```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "golang.go",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "usernamehw.errorlens"
  ]
}
```

### Workspace Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[go]": {
    "editor.defaultFormatter": "golang.go"
  },
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  },
  "go.lintTool": "golangci-lint",
  "go.lintFlags": ["--fast"]
}
```

## Debugging

### Backend (VS Code)

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "go",
      "request": "launch",
      "mode": "debug",
      "program": "${workspaceFolder}/cmd/server",
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

### Frontend (VS Code)

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## Testing

### Backend Tests

```bash
# Unit tests
go test ./...

# With verbose output
go test -v ./...

# Specific package
go test -v ./internal/handlers

# With coverage
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Integration tests (requires running services)
go test -tags=integration ./tests/integration/...
```

### Frontend Tests

```bash
# Unit tests with Vitest
pnpm test

# Watch mode
pnpm test:watch

# E2E tests with Playwright
pnpm test:e2e

# E2E with UI
pnpm test:e2e --ui
```

## Troubleshooting

### Port Conflicts

If ports are already in use:

```bash
# Find process using port
# Windows
netstat -ano | findstr :5432

# Linux/Mac
lsof -i :5432

# Kill process
# Windows
taskkill /PID <pid> /F

# Linux/Mac
kill -9 <pid>
```

### Docker Issues

```bash
# Reset Docker (careful - removes all containers/images)
docker system prune -a

# Check Docker disk usage
docker system df

# View running containers
docker ps

# View all containers
docker ps -a

# Remove stopped containers
docker container prune
```

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   docker compose -f docker/docker-compose.services.yml ps postgres
   ```

2. Check connection:
   ```bash
   docker exec -it entoo2-postgres pg_isready
   ```

3. Verify credentials match in `.env` files

### MinIO Issues

1. Access MinIO Console at http://localhost:9001
2. Default credentials: `minioadmin` / `minioadmin`
3. Ensure bucket exists: `documents`

### Search Not Working

1. Check Meilisearch is running:
   ```bash
   curl http://localhost:7700/health
   ```

2. Verify API key matches in backend `.env`

3. Reindex documents:
   ```bash
   make search-reindex
   ```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions

Example: `feature/document-upload`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add document upload endpoint
fix: correct file size validation
docs: update API documentation
refactor: extract validation logic
test: add upload handler tests
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Push branch and create PR
4. Wait for CI checks to pass
5. Request review
6. Merge after approval

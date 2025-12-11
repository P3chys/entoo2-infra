# System Architecture

## Overview

Entoo2 follows a microservices-inspired architecture with clear separation between frontend, backend, and infrastructure services. All services are containerized and orchestrated via Docker Compose.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENTS                                        │
│                    (Web Browsers - Desktop & Mobile)                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TRAEFIK (Reverse Proxy)                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  • SSL/TLS termination                                                   │    │
│  │  • Request routing (/api/* → backend, /* → frontend)                     │    │
│  │  • Rate limiting                                                         │    │
│  │  • CORS headers                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│     FRONTEND          │  │      BACKEND          │  │    STATIC FILES       │
│     (entoo2-web)      │  │     (entoo2-api)      │  │      (MinIO)          │
│  ┌─────────────────┐  │  │  ┌─────────────────┐  │  │  ┌─────────────────┐  │
│  │  SvelteKit      │  │  │  │  Go + Gin       │  │  │  │  S3-compatible  │  │
│  │  TypeScript     │  │  │  │  REST API       │  │  │  │  Object storage │  │
│  │  Tailwind CSS   │  │  │  │  JWT Auth       │  │  │  │  Documents      │  │
│  │  i18n (cs/en)   │  │  │  │  GORM ORM       │  │  │  │  Avatars        │  │
│  └─────────────────┘  │  │  └─────────────────┘  │  │  └─────────────────┘  │
└───────────────────────┘  └───────────────────────┘  └───────────────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
          ▼                            ▼                            ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│     POSTGRESQL        │  │        REDIS          │  │     MEILISEARCH       │
│  ┌─────────────────┐  │  │  ┌─────────────────┐  │  │  ┌─────────────────┐  │
│  │  Primary data   │  │  │  │  Session store  │  │  │  │  Full-text      │  │
│  │  Users          │  │  │  │  Cache layer    │  │  │  │  search         │  │
│  │  Subjects       │  │  │  │  Rate limiting  │  │  │  │  Fuzzy matching │  │
│  │  Documents      │  │  │  │  counters       │  │  │  │  Typo tolerance │  │
│  └─────────────────┘  │  │  └─────────────────┘  │  │  └─────────────────┘  │
└───────────────────────┘  └───────────────────────┘  └───────────────────────┘
                                                                 │
                                                                 ▼
                                                    ┌───────────────────────┐
                                                    │     APACHE TIKA       │
                                                    │  ┌─────────────────┐  │
                                                    │  │  Content        │  │
                                                    │  │  extraction     │  │
                                                    │  │  PDF, DOCX...   │  │
                                                    │  └─────────────────┘  │
                                                    └───────────────────────┘
```

## Component Details

### Frontend (entoo2-web)

**Technology:** SvelteKit 2.x with TypeScript

**Responsibilities:**
- Server-side rendering (SSR) for SEO and performance
- Client-side navigation and state management
- Internationalization (Czech/English)
- Theme switching (dark/light mode)
- File upload interface with drag-and-drop
- Real-time search with debouncing

**Key Libraries:**
- Tailwind CSS - Styling
- svelte-i18n - Internationalization
- svelte/store - State management

### Backend (entoo2-api)

**Technology:** Go 1.22+ with Gin framework

**Responsibilities:**
- RESTful API endpoints
- JWT authentication and authorization
- File upload processing and validation
- Integration with external services (MinIO, Meilisearch, Tika)
- Database migrations and ORM

**Key Libraries:**
- Gin - HTTP framework
- GORM - ORM
- golang-jwt - JWT handling
- minio-go - S3 client
- meilisearch-go - Search client

### PostgreSQL

**Purpose:** Primary data store

**Data Stored:**
- User accounts and authentication
- Semesters and subjects
- Document metadata
- Comments and Q&A
- Favorites

### Redis

**Purpose:** Caching and session management

**Use Cases:**
- JWT token blacklist (for logout)
- Rate limiting counters
- Session data
- Frequently accessed data cache

### MinIO

**Purpose:** S3-compatible object storage

**Content:**
- Uploaded documents (PDFs, DOCX, etc.)
- User avatars
- Temporary files during processing

**Buckets:**
- `documents` - Uploaded files
- `avatars` - User profile pictures
- `temp` - Temporary processing files

### Meilisearch

**Purpose:** Full-text search engine

**Indexes:**
- `documents` - Searchable document content
- `subjects` - Subject names and descriptions

**Features:**
- Typo tolerance
- Fuzzy matching
- Instant search
- Faceted filtering

### Apache Tika

**Purpose:** Document content extraction

**Supported Formats:**
- PDF
- DOCX, DOC
- PPTX, PPT
- XLSX, XLS
- TXT
- Images (OCR possible)

### Traefik

**Purpose:** Reverse proxy and load balancer

**Features:**
- Automatic SSL certificate management (Let's Encrypt)
- Path-based routing
- Rate limiting middleware
- CORS configuration
- Health checks

## Data Flow

### Document Upload Flow

```
1. User selects file in frontend
           │
           ▼
2. Frontend validates file type/size
           │
           ▼
3. Frontend uploads to API (multipart/form-data)
           │
           ▼
4. API validates request and user permissions
           │
           ▼
5. API stores file in MinIO (documents bucket)
           │
           ▼
6. API sends file to Tika for content extraction
           │
           ▼
7. API receives extracted text from Tika
           │
           ▼
8. API stores metadata in PostgreSQL
           │
           ▼
9. API indexes content in Meilisearch
           │
           ▼
10. API returns success response to frontend
```

### Search Flow

```
1. User types search query
           │
           ▼
2. Frontend debounces input (300ms)
           │
           ▼
3. Frontend sends search request to API
           │
           ▼
4. API queries Meilisearch with filters
           │
           ▼
5. Meilisearch returns matching document IDs
           │
           ▼
6. API fetches full metadata from PostgreSQL
           │
           ▼
7. API returns enriched results to frontend
           │
           ▼
8. Frontend displays results with highlighting
```

## Security Architecture

### Authentication

- JWT-based authentication
- Access tokens (15min expiry)
- Refresh tokens (7 days expiry, stored in httpOnly cookie)
- Password hashing with bcrypt (cost 10)

### Authorization

- Role-based access control (RBAC)
- Two roles: `student`, `admin`
- Middleware-based permission checks

### API Security

- Rate limiting (100 req/min per IP)
- Request size limits (50MB for uploads)
- Input validation on all endpoints
- SQL injection prevention via ORM
- XSS prevention via proper encoding

### File Security

- File type validation (MIME type + extension)
- Virus scanning (optional, via ClamAV)
- Signed URLs for file access
- No direct file path exposure

## Scalability Considerations

### Horizontal Scaling

- Stateless API design (session in Redis)
- Multiple API instances behind Traefik
- MinIO clustering for storage
- PostgreSQL read replicas

### Performance Optimizations

- CDN for static assets
- Redis caching for hot data
- Lazy loading in frontend
- Pagination for large lists
- Image optimization

## Monitoring & Observability

### Logging

- Structured JSON logs
- Log levels: DEBUG, INFO, WARN, ERROR
- Request ID tracking

### Metrics (Future)

- Prometheus metrics endpoint
- Grafana dashboards
- Alert rules

### Health Checks

- `/health` endpoint on API
- Docker healthchecks for all services
- Traefik health probes

## Deployment Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Local | Development | http://localhost |
| Staging | Testing | https://staging.entoo2.example |
| Production | Live | https://entoo2.example |

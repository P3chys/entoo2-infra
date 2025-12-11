# API Design Specification

## Overview

The Entoo2 API is a RESTful JSON API built with Go and Gin framework.

**Base URL:** `/api/v1`

## Conventions

### Request Format

- Content-Type: `application/json` (except file uploads)
- File uploads: `multipart/form-data`
- Authentication: `Authorization: Bearer <token>`

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": { ... }
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 413 | Payload Too Large |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Pagination

List endpoints support pagination:

```
GET /api/v1/documents?page=1&limit=20
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Localization

Include language preference in header:

```
Accept-Language: cs
```

Supported: `cs` (Czech), `en` (English)

---

## Authentication Endpoints

### POST /auth/register

Create a new user account.

**Request:**
```json
{
  "email": "student@example.com",
  "password": "securePassword123",
  "display_name": "Jan Novák",
  "language": "cs"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "display_name": "Jan Novák",
      "role": "student",
      "language": "cs",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- 400: Invalid email format, password too short
- 409: Email already exists

---

### POST /auth/login

Authenticate user and receive tokens.

**Request:**
```json
{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- 401: Invalid credentials

---

### POST /auth/logout

Invalidate current tokens.

**Headers:** `Authorization: Bearer <access_token>`

**Response (204):** No content

---

### POST /auth/refresh

Get new access token using refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### GET /auth/me

Get current user profile.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@example.com",
    "display_name": "Jan Novák",
    "role": "student",
    "language": "cs",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## Semester Endpoints

### GET /semesters

List all semesters.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "1. semestr",
      "order_index": 1,
      "subject_count": 5
    }
  ]
}
```

---

### POST /semesters

Create semester (Admin only).

**Request:**
```json
{
  "name_cs": "1. semestr",
  "name_en": "1st Semester",
  "order_index": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name_cs": "1. semestr",
    "name_en": "1st Semester",
    "order_index": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET /semesters/:id

Get semester details with subjects.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "1. semestr",
    "order_index": 1,
    "subjects": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Úvod do práva",
        "credits": 5,
        "document_count": 12,
        "is_favorite": true
      }
    ]
  }
}
```

---

### PUT /semesters/:id

Update semester (Admin only).

**Request:**
```json
{
  "name_cs": "1. semestr (zimní)",
  "name_en": "1st Semester (Winter)",
  "order_index": 1
}
```

---

### DELETE /semesters/:id

Delete semester (Admin only). Fails if semester has subjects.

**Response (204):** No content

**Errors:**
- 409: Semester has subjects

---

## Subject Endpoints

### GET /subjects

List all subjects with optional filters.

**Query Parameters:**
- `semester_id`: Filter by semester
- `page`, `limit`: Pagination

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "semester_id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Úvod do práva",
      "credits": 5,
      "document_count": 12,
      "comment_count": 5,
      "question_count": 3,
      "is_favorite": false
    }
  ],
  "pagination": { ... }
}
```

---

### POST /subjects

Create subject (Admin only).

**Request:**
```json
{
  "semester_id": "550e8400-e29b-41d4-a716-446655440001",
  "name_cs": "Úvod do práva",
  "name_en": "Introduction to Law",
  "description_cs": "Základní právní pojmy...",
  "description_en": "Basic legal concepts...",
  "credits": 5,
  "teachers": [
    {
      "teacher_name": "Prof. JUDr. Jan Novák",
      "topic_cs": "Teorie práva",
      "topic_en": "Legal Theory"
    }
  ]
}
```

---

### GET /subjects/:id

Get subject details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "semester": {
      "id": "...",
      "name": "1. semestr"
    },
    "name": "Úvod do práva",
    "description": "Základní právní pojmy...",
    "credits": 5,
    "teachers": [
      {
        "id": "...",
        "teacher_name": "Prof. JUDr. Jan Novák",
        "topic": "Teorie práva"
      }
    ],
    "document_count": 12,
    "comment_count": 5,
    "question_count": 3,
    "is_favorite": true
  }
}
```

---

### PUT /subjects/:id

Update subject (Admin only).

---

### DELETE /subjects/:id

Delete subject and all documents (Admin only).

---

## Document Endpoints

### GET /subjects/:id/documents

List documents in a subject.

**Query Parameters:**
- `page`, `limit`: Pagination
- `sort`: `created_at`, `-created_at`, `name`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "filename": "prednasky-tyden-1.pdf",
      "original_name": "Přednášky týden 1.pdf",
      "file_size": 2548576,
      "mime_type": "application/pdf",
      "uploaded_by": {
        "id": "...",
        "display_name": "Jan Novák"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### POST /subjects/:id/documents

Upload document to subject.

**Request:** `multipart/form-data`
- `file`: File (required, max 50MB)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "filename": "prednasky-tyden-1.pdf",
    "original_name": "Přednášky týden 1.pdf",
    "file_size": 2548576,
    "mime_type": "application/pdf",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- 400: Invalid file type
- 413: File too large

---

### GET /documents/:id

Get document metadata.

---

### GET /documents/:id/download

Download document file.

**Response:** Binary file with appropriate Content-Type and Content-Disposition headers.

---

### DELETE /documents/:id

Delete document (owner or admin only).

**Response (204):** No content

---

## Comment Endpoints

### GET /subjects/:id/comments

List comments for a subject.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440030",
      "content": "Velmi užitečné materiály!",
      "user": {
        "id": "...",
        "display_name": "Jana Nováková"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### POST /subjects/:id/comments

Create comment.

**Request:**
```json
{
  "content": "Velmi užitečné materiály!"
}
```

---

### DELETE /comments/:id

Delete comment (owner or admin only).

---

## Question & Answer Endpoints

### GET /subjects/:id/questions

List questions for a subject.

**Query Parameters:**
- `answered`: `true`, `false`, or omit for all

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440040",
      "title": "Rozdíl mezi právem veřejným a soukromým?",
      "content": "Může mi někdo vysvětlit...",
      "is_answered": true,
      "answer_count": 3,
      "user": {
        "id": "...",
        "display_name": "Petr Svoboda"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST /subjects/:id/questions

Create question.

**Request:**
```json
{
  "title": "Rozdíl mezi právem veřejným a soukromým?",
  "content": "Může mi někdo vysvětlit hlavní rozdíly?"
}
```

---

### GET /questions/:id

Get question with answers.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Rozdíl mezi právem veřejným a soukromým?",
    "content": "Může mi někdo vysvětlit...",
    "is_answered": true,
    "user": { ... },
    "answers": [
      {
        "id": "...",
        "content": "Veřejné právo upravuje vztahy...",
        "is_accepted": true,
        "user": { ... },
        "created_at": "..."
      }
    ]
  }
}
```

---

### POST /questions/:id/answers

Answer a question.

**Request:**
```json
{
  "content": "Veřejné právo upravuje vztahy mezi státem a jednotlivcem..."
}
```

---

### PUT /answers/:id/accept

Mark answer as accepted (question author only).

---

### DELETE /questions/:id

Delete question and answers (owner or admin only).

---

### DELETE /answers/:id

Delete answer (owner or admin only).

---

## Favorite Endpoints

### GET /favorites

Get user's favorite subjects.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Úvod do práva",
      "credits": 5,
      "semester": { ... },
      "document_count": 12
    }
  ]
}
```

---

### POST /subjects/:id/favorite

Add subject to favorites.

**Response (201):**
```json
{
  "success": true,
  "message": "Subject added to favorites"
}
```

---

### DELETE /subjects/:id/favorite

Remove subject from favorites.

**Response (204):** No content

---

## Search Endpoints

### GET /search

Search documents and subjects.

**Query Parameters:**
- `q`: Search query (required)
- `type`: `documents`, `subjects`, or `all` (default)
- `semester_id`: Filter by semester
- `subject_id`: Filter by subject
- `page`, `limit`: Pagination

**Response (200):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "...",
        "filename": "prednasky.pdf",
        "subject": { "id": "...", "name": "Úvod do práva" },
        "highlight": "...ustanovení <mark>občanského zákoníku</mark>..."
      }
    ],
    "subjects": [
      {
        "id": "...",
        "name": "Občanské právo",
        "highlight": "...<mark>občanské</mark> právo hmotné..."
      }
    ]
  },
  "pagination": { ... }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `FILE_TOO_LARGE` | Upload exceeds 50MB |
| `INVALID_FILE_TYPE` | Unsupported file format |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

- **Anonymous:** 20 requests/minute
- **Authenticated:** 100 requests/minute
- **Uploads:** 10 uploads/minute

Headers included in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248960
```

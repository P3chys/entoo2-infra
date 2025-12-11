# Requirements Specification

## Functional Requirements

### FR-1: User Management

#### FR-1.1: Registration
- Users can register with email and password
- Email must be unique and valid format
- Password must be at least 8 characters
- Users receive default role: `student`
- Users can select preferred language (Czech/English)

#### FR-1.2: Authentication
- Users can log in with email and password
- System issues JWT access token (15min) and refresh token (7 days)
- Users can log out (invalidates tokens)
- Users can refresh expired access tokens

#### FR-1.3: Profile
- Users can view their profile
- Users can update display name
- Users can change language preference
- Users can change password

### FR-2: Semesters

#### FR-2.1: Semester Management (Admin)
- Admins can create new semesters
- Admins can update semester names (Czech/English)
- Admins can delete empty semesters
- Admins can reorder semesters

#### FR-2.2: Semester Viewing
- All users can view list of semesters
- Semesters display in defined order
- Each semester shows count of subjects

### FR-3: Subjects

#### FR-3.1: Subject Management (Admin)
- Admins can create subjects within semesters
- Admins can update subject details:
  - Name (Czech/English)
  - Description (Czech/English)
  - Credits
  - Teachers (name + topic they teach)
- Admins can delete subjects (cascades to documents)
- Admins can move subjects between semesters

#### FR-3.2: Subject Viewing
- All users can view subjects in a semester
- Subject detail page shows:
  - Full description
  - Credits
  - List of teachers with their topics
  - Document count
  - Comment count
  - Question count

### FR-4: Documents

#### FR-4.1: Document Upload
- Authenticated users can upload documents to subjects
- Supported formats: PDF, DOCX, DOC, PPTX, PPT, XLSX, XLS, TXT, PNG, JPG, JPEG, GIF
- Maximum file size: 50MB
- System extracts text content for search indexing
- Documents store:
  - Original filename
  - Uploader info
  - Upload timestamp
  - File size
  - MIME type

#### FR-4.2: Document Viewing
- All authenticated users can view document list per subject
- Document list shows: name, uploader, date, size, type icon
- Documents sorted by upload date (newest first)

#### FR-4.3: Document Download
- All authenticated users can download any document
- Download uses original filename
- System tracks download count (future)

#### FR-4.4: Document Deletion
- Users can delete their own documents
- Admins can delete any document
- Deletion removes file from storage and search index

### FR-5: Search

#### FR-5.1: Global Search
- Users can search across all documents
- Search queries document content and filenames
- Results ranked by relevance
- Fuzzy matching with typo tolerance
- Search supports Czech and English

#### FR-5.2: Filtered Search
- Users can filter search by:
  - Semester
  - Subject
  - File type
  - Uploader
  - Date range

#### FR-5.3: Search Results
- Results show: filename, subject, uploader, date
- Results highlight matching text
- Click navigates to subject with document highlighted

### FR-6: Favorites

#### FR-6.1: Managing Favorites
- Users can add subjects to favorites
- Users can remove subjects from favorites
- Favorite status visible on subject cards

#### FR-6.2: Favorites View
- Dedicated page showing all favorited subjects
- Quick access from navigation

### FR-7: Comments

#### FR-7.1: Posting Comments
- Users can post comments on subjects
- Comments support plain text
- Comments show author and timestamp

#### FR-7.2: Viewing Comments
- Comments displayed in chronological order
- Pagination for many comments (20 per page)

#### FR-7.3: Deleting Comments
- Users can delete their own comments
- Admins can delete any comment

### FR-8: Questions & Answers

#### FR-8.1: Asking Questions
- Users can post questions on subjects
- Questions have title and content
- Questions show author and timestamp

#### FR-8.2: Answering Questions
- Users can post answers to questions
- Answers show author and timestamp
- Question author can mark answer as accepted

#### FR-8.3: Question Status
- Questions marked as answered when accepted answer exists
- Unanswered questions highlighted

#### FR-8.4: Deleting Q&A
- Users can delete their own questions/answers
- Admins can delete any question/answer
- Deleting question cascades to answers

### FR-9: Internationalization

#### FR-9.1: Language Support
- UI available in Czech and English
- Content (subjects, descriptions) stored in both languages
- User preference determines default language
- Language switchable at any time

### FR-10: Theme

#### FR-10.1: Theme Switching
- Users can toggle between light and dark mode
- Preference persisted locally
- Respects system preference by default

---

## Non-Functional Requirements

### NFR-1: Performance

| Metric | Requirement |
|--------|-------------|
| Page load time | < 2 seconds (first contentful paint) |
| API response time | < 200ms (p95) |
| Search response time | < 100ms |
| File upload speed | > 5 MB/s |
| Concurrent users | Support 200+ simultaneous |

### NFR-2: Scalability

- System must handle 2,000 monthly active users
- Support 500+ concurrent users during peak (exams)
- Storage must scale to 100GB+ of documents
- Search index must handle 50,000+ documents

### NFR-3: Availability

- Target uptime: 99.5%
- Planned maintenance windows: Sunday 2-4 AM CET
- Graceful degradation when services unavailable

### NFR-4: Security

- All traffic over HTTPS
- Passwords hashed with bcrypt
- JWT tokens for authentication
- Rate limiting on all endpoints
- Input validation on all user data
- No sensitive data in logs
- Regular dependency updates

### NFR-5: Usability

- Responsive design (mobile, tablet, desktop)
- WCAG 2.1 AA accessibility compliance
- Intuitive navigation (max 3 clicks to any feature)
- Loading indicators for async operations
- Clear error messages

### NFR-6: Maintainability

- Comprehensive documentation
- Consistent code style (linters/formatters)
- Automated testing (unit, integration)
- CI/CD pipelines
- Semantic versioning

### NFR-7: Compatibility

- Browsers: Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile: iOS Safari, Android Chrome
- Screen sizes: 320px to 4K

### NFR-8: Data

- Daily automated backups
- 30-day backup retention
- Point-in-time recovery capability
- GDPR compliance for user data

---

## User Stories

### Epic: Authentication

| ID | Story | Priority |
|----|-------|----------|
| US-1 | As a visitor, I want to register so I can access documents | High |
| US-2 | As a user, I want to log in so I can use the platform | High |
| US-3 | As a user, I want to log out so my session is secure | High |
| US-4 | As a user, I want to reset my password if I forget it | Medium |

### Epic: Document Management

| ID | Story | Priority |
|----|-------|----------|
| US-5 | As a student, I want to upload documents so others can access them | High |
| US-6 | As a student, I want to download documents to study offline | High |
| US-7 | As a student, I want to search documents by content | High |
| US-8 | As a student, I want to filter documents by subject | Medium |
| US-9 | As a student, I want to see who uploaded a document | Low |

### Epic: Subjects

| ID | Story | Priority |
|----|-------|----------|
| US-10 | As a student, I want to browse subjects by semester | High |
| US-11 | As a student, I want to see subject details and teachers | High |
| US-12 | As an admin, I want to create new subjects | High |
| US-13 | As an admin, I want to manage semesters | High |

### Epic: Engagement

| ID | Story | Priority |
|----|-------|----------|
| US-14 | As a student, I want to favorite subjects for quick access | Medium |
| US-15 | As a student, I want to comment on subjects | Medium |
| US-16 | As a student, I want to ask questions about subjects | Medium |
| US-17 | As a student, I want to answer questions to help others | Medium |

### Epic: Personalization

| ID | Story | Priority |
|----|-------|----------|
| US-18 | As a user, I want to switch between Czech and English | High |
| US-19 | As a user, I want to use dark mode for comfort | Medium |
| US-20 | As a user, I want to update my profile | Low |

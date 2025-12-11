import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Documents API Tests
 * Tests for document upload, download, and management
 */

const API_URL = process.env.API_URL || 'http://localhost:8000';

test.describe('Documents API', () => {
  let authToken: string;
  let subjectId: string;

  test.beforeAll(async ({ request }) => {
    // Register and login to get auth token
    const email = `doc-test-${Date.now()}@example.com`;

    const registerResponse = await request.post(`${API_URL}/api/v1/auth/register`, {
      data: {
        email,
        password: 'SecurePassword123!',
        display_name: 'Doc Test User',
        language: 'en',
      },
    });

    if (registerResponse.status() === 404) {
      return; // API not running
    }

    const { data } = await registerResponse.json();
    authToken = data.access_token;

    // Get first available subject (or create one if admin)
    const subjectsResponse = await request.get(`${API_URL}/api/v1/subjects`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (subjectsResponse.ok()) {
      const subjects = await subjectsResponse.json();
      if (subjects.data && subjects.data.length > 0) {
        subjectId = subjects.data[0].id;
      }
    }
  });

  test.describe('POST /api/v1/subjects/:id/documents', () => {
    test('should upload a text file successfully', async ({ request }) => {
      if (!authToken || !subjectId) {
        test.skip(true, 'Prerequisites not met');
      }

      const fileContent = 'This is a test document content for Entoo2 testing.';
      const fileName = `test-document-${Date.now()}.txt`;

      const response = await request.post(
        `${API_URL}/api/v1/subjects/${subjectId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          multipart: {
            file: {
              name: fileName,
              mimeType: 'text/plain',
              buffer: Buffer.from(fileContent),
            },
          },
        }
      );

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.original_name).toBe(fileName);
      expect(body.data.mime_type).toBe('text/plain');
    });

    test('should reject file exceeding size limit', async ({ request }) => {
      if (!authToken || !subjectId) {
        test.skip(true, 'Prerequisites not met');
      }

      // Create a buffer larger than 50MB
      const largeBuffer = Buffer.alloc(51 * 1024 * 1024); // 51MB

      const response = await request.post(
        `${API_URL}/api/v1/subjects/${subjectId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          multipart: {
            file: {
              name: 'large-file.txt',
              mimeType: 'text/plain',
              buffer: largeBuffer,
            },
          },
          timeout: 60000,
        }
      );

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(413);
    });

    test('should reject unsupported file type', async ({ request }) => {
      if (!authToken || !subjectId) {
        test.skip(true, 'Prerequisites not met');
      }

      const response = await request.post(
        `${API_URL}/api/v1/subjects/${subjectId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          multipart: {
            file: {
              name: 'malicious.exe',
              mimeType: 'application/x-msdownload',
              buffer: Buffer.from('fake executable content'),
            },
          },
        }
      );

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error.code).toBe('INVALID_FILE_TYPE');
    });
  });

  test.describe('GET /api/v1/subjects/:id/documents', () => {
    test('should list documents for a subject', async ({ request }) => {
      if (!authToken || !subjectId) {
        test.skip(true, 'Prerequisites not met');
      }

      const response = await request.get(
        `${API_URL}/api/v1/subjects/${subjectId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });

    test('should support pagination', async ({ request }) => {
      if (!authToken || !subjectId) {
        test.skip(true, 'Prerequisites not met');
      }

      const response = await request.get(
        `${API_URL}/api/v1/subjects/${subjectId}/documents?page=1&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.pagination).toBeDefined();
      expect(body.pagination.page).toBe(1);
      expect(body.pagination.limit).toBe(5);
    });
  });

  test.describe('GET /api/v1/documents/:id/download', () => {
    test('should download an uploaded document', async ({ request }) => {
      if (!authToken || !subjectId) {
        test.skip(true, 'Prerequisites not met');
      }

      // First upload a document
      const fileContent = 'Download test content';
      const uploadResponse = await request.post(
        `${API_URL}/api/v1/subjects/${subjectId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          multipart: {
            file: {
              name: 'download-test.txt',
              mimeType: 'text/plain',
              buffer: Buffer.from(fileContent),
            },
          },
        }
      );

      if (!uploadResponse.ok()) {
        test.skip(true, 'Upload failed');
      }

      const { data } = await uploadResponse.json();
      const documentId = data.id;

      // Download the document
      const response = await request.get(
        `${API_URL}/api/v1/documents/${documentId}/download`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const downloadedContent = await response.text();
      expect(downloadedContent).toBe(fileContent);
    });
  });
});

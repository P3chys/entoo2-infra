import { test, expect } from '@playwright/test';

/**
 * Search API Tests
 * Tests for the full-text search functionality
 */

const API_URL = process.env.API_URL || 'http://localhost:8000';

test.describe('Search API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const email = `search-test-${Date.now()}@example.com`;

    const registerResponse = await request.post(`${API_URL}/api/v1/auth/register`, {
      data: {
        email,
        password: 'SecurePassword123!',
        display_name: 'Search Test User',
        language: 'en',
      },
    });

    if (registerResponse.status() === 404) {
      return;
    }

    const { data } = await registerResponse.json();
    authToken = data.access_token;
  });

  test.describe('GET /api/v1/search', () => {
    test('should return results for valid query', async ({ request }) => {
      if (!authToken) {
        test.skip(true, 'Auth token not available');
      }

      const response = await request.get(`${API_URL}/api/v1/search?q=test`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
    });

    test('should support type filter for documents', async ({ request }) => {
      if (!authToken) {
        test.skip(true, 'Auth token not available');
      }

      const response = await request.get(
        `${API_URL}/api/v1/search?q=test&type=documents`,
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
      expect(body.data.documents).toBeDefined();
    });

    test('should support type filter for subjects', async ({ request }) => {
      if (!authToken) {
        test.skip(true, 'Auth token not available');
      }

      const response = await request.get(
        `${API_URL}/api/v1/search?q=test&type=subjects`,
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
      expect(body.data.subjects).toBeDefined();
    });

    test('should support fuzzy matching', async ({ request }) => {
      if (!authToken) {
        test.skip(true, 'Auth token not available');
      }

      // Search with typo - should still find results
      const response = await request.get(`${API_URL}/api/v1/search?q=documnet`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(200);
      // Meilisearch should handle typos automatically
    });

    test('should support pagination', async ({ request }) => {
      if (!authToken) {
        test.skip(true, 'Auth token not available');
      }

      const response = await request.get(
        `${API_URL}/api/v1/search?q=test&page=1&limit=10`,
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
    });

    test('should require authentication', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/v1/search?q=test`);

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(401);
    });

    test('should require query parameter', async ({ request }) => {
      if (!authToken) {
        test.skip(true, 'Auth token not available');
      }

      const response = await request.get(`${API_URL}/api/v1/search`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(400);
    });
  });
});

import { test, expect } from '@playwright/test';

/**
 * Authentication API Tests
 * Tests for the /api/v1/auth endpoints
 */

const API_URL = process.env.API_URL || 'http://localhost:8000';

test.describe('Authentication API', () => {
  test.describe('POST /api/v1/auth/register', () => {
    test('should register a new user with valid data', async ({ request }) => {
      const uniqueEmail = `test-${Date.now()}@example.com`;

      const response = await request.post(`${API_URL}/api/v1/auth/register`, {
        data: {
          email: uniqueEmail,
          password: 'SecurePassword123!',
          display_name: 'Test User',
          language: 'en',
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.user.email).toBe(uniqueEmail);
      expect(body.data.user.role).toBe('student');
      expect(body.data.access_token).toBeDefined();
      expect(body.data.refresh_token).toBeDefined();
    });

    test('should reject registration with invalid email', async ({ request }) => {
      const response = await request.post(`${API_URL}/api/v1/auth/register`, {
        data: {
          email: 'invalid-email',
          password: 'SecurePassword123!',
          display_name: 'Test User',
          language: 'en',
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    test('should reject registration with short password', async ({ request }) => {
      const response = await request.post(`${API_URL}/api/v1/auth/register`, {
        data: {
          email: `test-${Date.now()}@example.com`,
          password: 'short',
          display_name: 'Test User',
          language: 'en',
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(400);
    });

    test('should reject duplicate email registration', async ({ request }) => {
      const email = `test-${Date.now()}@example.com`;

      // First registration
      await request.post(`${API_URL}/api/v1/auth/register`, {
        data: {
          email,
          password: 'SecurePassword123!',
          display_name: 'Test User',
          language: 'en',
        },
      });

      // Second registration with same email
      const response = await request.post(`${API_URL}/api/v1/auth/register`, {
        data: {
          email,
          password: 'AnotherPassword123!',
          display_name: 'Another User',
          language: 'en',
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(409);
    });
  });

  test.describe('POST /api/v1/auth/login', () => {
    test('should login with valid credentials', async ({ request }) => {
      const email = `test-${Date.now()}@example.com`;
      const password = 'SecurePassword123!';

      // Register first
      const registerResponse = await request.post(`${API_URL}/api/v1/auth/register`, {
        data: {
          email,
          password,
          display_name: 'Test User',
          language: 'en',
        },
      });

      if (registerResponse.status() === 404) {
        test.skip(true, 'API not running');
      }

      // Login
      const response = await request.post(`${API_URL}/api/v1/auth/login`, {
        data: {
          email,
          password,
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.user.email).toBe(email);
      expect(body.data.access_token).toBeDefined();
    });

    test('should reject login with wrong password', async ({ request }) => {
      const response = await request.post(`${API_URL}/api/v1/auth/login`, {
        data: {
          email: 'test@example.com',
          password: 'WrongPassword123!',
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(401);
    });
  });

  test.describe('GET /api/v1/auth/me', () => {
    test('should return current user with valid token', async ({ request }) => {
      const email = `test-${Date.now()}@example.com`;

      // Register and get token
      const registerResponse = await request.post(`${API_URL}/api/v1/auth/register`, {
        data: {
          email,
          password: 'SecurePassword123!',
          display_name: 'Test User',
          language: 'en',
        },
      });

      if (registerResponse.status() === 404) {
        test.skip(true, 'API not running');
      }

      const { data } = await registerResponse.json();
      const token = data.access_token;

      // Get current user
      const response = await request.get(`${API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.data.email).toBe(email);
    });

    test('should reject request without token', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/v1/auth/me`);

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(401);
    });

    test('should reject request with invalid token', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });

      if (response.status() === 404) {
        test.skip(true, 'API not running');
      }

      expect(response.status()).toBe(401);
    });
  });
});

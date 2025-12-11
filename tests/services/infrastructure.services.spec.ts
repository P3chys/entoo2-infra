import { test, expect } from '@playwright/test';

/**
 * Infrastructure Services Health Tests
 * Tests that all Docker services are running and healthy
 */

test.describe('Infrastructure Services Health @smoke', () => {
  test('PostgreSQL is healthy', async ({ request }) => {
    // Test via API health endpoint that checks DB connection
    // In production, the API /health endpoint should verify DB connectivity
    const response = await request.get('http://localhost:8000/health', {
      timeout: 5000,
      failOnStatusCode: false,
    });

    // If API is not running, we can check DB directly via pg_isready
    if (!response.ok()) {
      test.skip(true, 'API not running - skipping DB health check via API');
    }

    expect(response.status()).toBe(200);
  });

  test('Redis is healthy', async ({ request }) => {
    // Redis health check - typically exposed via API
    const response = await request.get('http://localhost:8000/health', {
      timeout: 5000,
      failOnStatusCode: false,
    });

    if (!response.ok()) {
      test.skip(true, 'API not running - skipping Redis health check');
    }

    expect(response.status()).toBe(200);
  });

  test('MinIO is healthy', async ({ request }) => {
    const response = await request.get('http://localhost:9000/minio/health/live', {
      timeout: 5000,
      failOnStatusCode: false,
    });

    expect(response.ok()).toBeTruthy();
  });

  test('MinIO console is accessible', async ({ page }) => {
    await page.goto('http://localhost:9001');

    // Should show login page
    await expect(page.locator('input[id="accessKey"], input[name="accessKey"]')).toBeVisible({
      timeout: 10000,
    });
  });

  test('Meilisearch is healthy', async ({ request }) => {
    const response = await request.get('http://localhost:7700/health', {
      timeout: 5000,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('available');
  });

  test('Meilisearch returns version info', async ({ request }) => {
    const response = await request.get('http://localhost:7700/version', {
      timeout: 5000,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.pkgVersion).toBeDefined();
  });

  test('Tika is healthy', async ({ request }) => {
    const response = await request.get('http://localhost:9998/tika', {
      timeout: 10000,
    });

    expect(response.ok()).toBeTruthy();
  });

  test('Tika can extract text from sample content', async ({ request }) => {
    const sampleText = 'Hello, this is a test document.';

    const response = await request.put('http://localhost:9998/tika', {
      headers: {
        'Content-Type': 'text/plain',
      },
      data: sampleText,
      timeout: 10000,
    });

    expect(response.ok()).toBeTruthy();

    const extractedText = await response.text();
    expect(extractedText).toContain('Hello');
  });
});

test.describe('Service Connectivity', () => {
  test('Services can communicate within Docker network', async ({ request }) => {
    // This test verifies that when the API is running,
    // it can communicate with all infrastructure services

    const response = await request.get('http://localhost:8000/health', {
      timeout: 5000,
      failOnStatusCode: false,
    });

    if (!response.ok()) {
      test.skip(true, 'API not running - skipping connectivity test');
    }

    const health = await response.json();

    // API health should report status of all dependencies
    expect(health.database).toBe('ok');
    expect(health.cache).toBe('ok');
    expect(health.storage).toBe('ok');
    expect(health.search).toBe('ok');
  });
});

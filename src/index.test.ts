import { beforeEach, describe, expect, it, vi } from 'vitest';

import app from './index';

describe('API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /health returns running status', async () => {
    const res = await app.request('/health');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: 'running' });
  });

  it('GET /unknown returns 404', async () => {
    const res = await app.request('/unknown');

    expect(res.status).toBe(404);
  });
});

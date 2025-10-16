import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchRepositoriesParams } from '../repositories/repositories.type';
import { GitHubClient } from './github.client';
import { GitHubSearchResponseDto } from './github.dto';

describe('GitHubClient', () => {
  let client: GitHubClient;
  let mockFetch: any;

  beforeEach(() => {
    mockFetch = vi.fn();
    globalThis.fetch = mockFetch as any;
    client = new GitHubClient();
  });

  describe('fetchGitHubRepositories', () => {
    const validResponse = {
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          id: 1,
          name: 'test-repo',
          full_name: 'test/test-repo',
          html_url: 'https://github.com/test/test-repo',
          description: 'Test repository',
          language: 'TypeScript',
          stargazers_count: 100,
          forks_count: 5,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-02-01T00:00:00Z',
          pushed_at: '2024-02-10T00:00:00Z',
          owner: { login: 'test', id: 123 },
        },
      ],
    };

    const searchParams: SearchRepositoriesParams = {
      language: 'typescript',
      createdAt: '2024-01-01',
      pageNumber: 1,
      pageSize: 10,
    };

    it('should fetch and validate repositories successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(validResponse),
      });

      const result = await client.fetchGitHubRepositories(searchParams);

      expect(result).toBeInstanceOf(GitHubSearchResponseDto);
      expect(result.totalCount).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it('should throw error on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not found'),
      });

      await expect(client.fetchGitHubRepositories(searchParams)).rejects.toThrow(
        'github: search.repositories HTTP 404',
      );
    });

    it('should throw error on invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(),
      });

      await expect(client.fetchGitHubRepositories(searchParams)).rejects.toThrow(
        'github: search.repositories invalid JSON',
      );
    });

    it('should throw error on invalid response schema', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: 'response' }),
      });

      await expect(client.fetchGitHubRepositories(searchParams)).rejects.toThrow(
        'github: response validation failed',
      );
    });
  });
});

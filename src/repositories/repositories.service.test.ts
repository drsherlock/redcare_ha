import type { Logger } from 'pino';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GitHubClientInterface } from '../github/github.client.interface';
import { RepositoriesService } from './repositories.service';
import type { SearchRepositoriesParams } from './repositories.type';
import * as util from './repositories.util';

const mockLogger: Partial<Logger> = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
};

const mockGitHubClient = {
  fetchGitHubRepositories: vi.fn(),
} as unknown as GitHubClientInterface;

const mockRepos = {
  items: [
    { id: 1, name: 'repo1', stargazersCount: 10, forksCount: 5, daysSinceUpdate: 2 },
    { id: 2, name: 'repo2', stargazersCount: 20, forksCount: 10, daysSinceUpdate: 1 },
  ],
  totalCount: 2,
  incompleteResults: false,
};

describe('RepositoriesService', () => {
  let service: RepositoriesService;

  beforeEach(() => {
    vi.restoreAllMocks();
    (mockGitHubClient.fetchGitHubRepositories as any).mockResolvedValue(mockRepos);

    vi.spyOn(util, 'calculateWeightedScore').mockImplementation(
      ({ stars, forks, daysSinceUpdate }) => stars + forks - daysSinceUpdate,
    );

    service = new RepositoriesService(mockGitHubClient, mockLogger as Logger);
  });

  it('calls githubClient.fetchGitHubRepositories with correct params', async () => {
    const params: SearchRepositoriesParams = {
      pageNumber: 1,
      pageSize: 10,
      language: 'JavaScript',
      createdAt: '2023-01-01',
    };

    await service.searchRepositories(params);

    expect(mockGitHubClient.fetchGitHubRepositories).toHaveBeenCalledWith(params);
  });

  it('calculates weighted score for each repository', async () => {
    await service.searchRepositories({
      pageNumber: 1,
      pageSize: 10,
      language: 'JavaScript',
      createdAt: '2023-01-01',
    });

    expect(util.calculateWeightedScore).toHaveBeenCalledTimes(mockRepos.items.length);
    mockRepos.items.forEach((repo) => {
      expect(util.calculateWeightedScore).toHaveBeenCalledWith({
        stars: repo.stargazersCount,
        forks: repo.forksCount,
        daysSinceUpdate: repo.daysSinceUpdate,
      });
    });
  });

  it('sorts repositories by score descending', async () => {
    const result = await service.searchRepositories({
      pageNumber: 1,
      pageSize: 10,
      language: 'JavaScript',
      createdAt: '2023-01-01',
    });

    expect(result.items[0].name).toBe('repo2');
    expect(result.items[1].name).toBe('repo1');
  });

  it('returns correct pagination info', async () => {
    const params: SearchRepositoriesParams = {
      pageNumber: 1,
      pageSize: 1,
      language: 'JavaScript',
      createdAt: '2023-01-01',
    };
    (mockGitHubClient.fetchGitHubRepositories as any).mockResolvedValue({
      ...mockRepos,
      totalCount: 2,
    });

    const result = await service.searchRepositories(params);

    expect(result.pageNumber).toBe(1);
    expect(result.pageSize).toBe(1);
    expect(result.hasNextPage).toBe(true);
  });

  it('handles empty repositories list', async () => {
    (mockGitHubClient.fetchGitHubRepositories as any).mockResolvedValue({
      items: [],
      totalCount: 0,
      incompleteResults: false,
    });

    const result = await service.searchRepositories({
      pageNumber: 1,
      pageSize: 10,
      language: 'JavaScript',
      createdAt: '2023-01-01',
    });

    expect(result.items).toEqual([]);
    expect(result.totalCount).toBe(0);
    expect(result.hasNextPage).toBe(false);
  });
});

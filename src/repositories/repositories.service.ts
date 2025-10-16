import type { Logger } from 'pino';

import { githubClient } from '../github/github.client';
import { GitHubClientInterface } from '../github/github.client.interface';
import { getServiceLogger } from '../logger';
import { RepositoriesServiceInterface } from './repositories.service.interface';
import { SearchRepositoriesParams, SearchRepositoriesResponse } from './repositories.type';
import { calculateWeightedScore } from './repositories.util';

export class RepositoriesService implements RepositoriesServiceInterface {
  constructor(
    private githubClient: GitHubClientInterface,
    private logger: Logger = getServiceLogger('repositories'),
  ) {}

  async searchRepositories(
    searchParams: SearchRepositoriesParams,
  ): Promise<SearchRepositoriesResponse> {
    this.logger.info({ message: 'Searching repositories' }, 'search_started');

    const repositories = await this.githubClient.fetchGitHubRepositories(searchParams);

    const repositoriesWithScore = repositories.items
      .map((repo) => ({
        ...repo,
        score: calculateWeightedScore({
          stars: repo.stargazersCount,
          forks: repo.forksCount,
          daysSinceUpdate: repo.daysSinceUpdate,
        }),
      }))
      .sort((a, b) => b.score - a.score);

    this.logger.info({ totalCount: repositories.totalCount }, 'search_completed');

    return {
      items: repositoriesWithScore,
      totalCount: repositories.totalCount,
      pageNumber: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      hasNextPage: searchParams.pageNumber * searchParams.pageSize < repositories.totalCount,
    };
  }
}

export const repositoriesService = new RepositoriesService(githubClient);

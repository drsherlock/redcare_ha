import type { Logger } from 'pino';

import { githubClient } from '../github/github.client';
import { GitHubClientInterface } from '../github/github.client.interface';
import { getServiceLogger } from '../logger';
import { RepositoriesServiceInterface } from './repositories.service.interface';
import { SearchRepositoriesParams, SearchRepositoriesResponse } from './repositories.type';

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

    const repositoriesWithScore = repositories.items.map((repo) => ({
      ...repo,
      score: 0,
    }));

    this.logger.info({ total: repositories.totalCount }, 'search_completed');

    return {
      totalCount: repositories.totalCount,
      incompleteResults: repositories.incompleteResults,
      items: repositoriesWithScore,
    };
  }
}

export const repositoriesService = new RepositoriesService(githubClient);

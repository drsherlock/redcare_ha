import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Logger } from 'pino';

import { getServiceLogger } from '../logger';
import { SearchRepositoriesParams } from '../repositories/repositories.type';
import { GitHubClientInterface } from './github.client.interface';
import { GitHubSearchResponseDto } from './github.dto';
import { buildRepoSearchQuery } from './github.util';

export class GitHubClient implements GitHubClientInterface {
  private readonly baseUrl = process.env.GITHUB_BASE_URL ?? 'https://api.github.com';
  private readonly defaultHeaders = {
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };

  constructor(private logger: Logger = getServiceLogger('github')) {}

  async fetchGitHubRepositories(
    searchParams: SearchRepositoriesParams,
  ): Promise<GitHubSearchResponseDto> {
    const query = buildRepoSearchQuery(searchParams);
    const url = `${this.baseUrl}/search/repositories?${query.toString()}`;

    try {
      this.logger.info({ url }, 'fetching_repositories');

      const raw = await this.getJson<unknown>(url, 'search.repositories');
      return this.validateResponse(GitHubSearchResponseDto, raw);
    } catch (error: any) {
      this.logger.error({ error }, 'fetching_repositories_failed');
      throw new Error(`github: fetchGitHubRepositories failed: ${error?.message}`);
    }
  }

  private async getJson<T>(url: string, label: string): Promise<T> {
    const res = await fetch(url, { headers: this.defaultHeaders }).catch((err) => {
      throw new Error(`github: ${label} fetch error (${url}): ${err.message}`);
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`github: ${label} HTTP ${res.status} (${url})` + body);
    }

    const json = await res.json().catch(() => {
      throw new Error(`github: ${label} invalid JSON (${url})`);
    });
    return json as T;
  }

  private async validateResponse(cls: new () => any, raw: unknown) {
    const dto = plainToInstance(cls, raw, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: false });
    if (errors.length > 0) {
      this.logger.error({ errors }, 'response_validation_failed');
      throw new Error('github: response validation failed');
    }
    return dto;
  }
}

export const githubClient = new GitHubClient();

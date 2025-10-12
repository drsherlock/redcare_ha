import { SearchRepositoriesParams } from '../repositories/repositories.type';
import { GitHubSearchResponseDto } from './github.dto';

export interface GitHubClientInterface {
  fetchGitHubRepositories(searchParams: SearchRepositoriesParams): Promise<GitHubSearchResponseDto>;
}

import { SearchRepositoriesParams, SearchRepositoriesResponse } from './repositories.type';

export interface RepositoriesServiceInterface {
  searchRepositories(searchParams: SearchRepositoriesParams): Promise<SearchRepositoriesResponse>;
}

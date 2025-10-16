export type SearchRepositoriesParams = {
  language: string;
  createdAt: string;
  pageNumber: number;
  pageSize: number;
};

export type SearchRepositoriesResponse = {
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  totalCount: number;
  items: Array<{
    id: number;
    name: string;
    fullName: string;
    htmlUrl: string;
    description?: string;
    language?: string;
    stargazersCount: number;
    forksCount: number;
    score: number;
    createdAt: Date;
    updatedAt: Date;
    pushedAt: Date;
    owner?: {
      login: string;
      id: number;
    };
  }>;
};

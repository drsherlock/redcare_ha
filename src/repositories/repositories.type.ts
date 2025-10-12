export type SearchRepositoriesParams = {
  language?: string;
  createdDate?: string;
  pageNumber: number;
  pageSize: number;
};

export type SearchRepositoriesResponse = {
  totalCount: number;
  incompleteResults: boolean;
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

    recencyDays: number;

    owner?: {
      login: string;
      id: number;
    };
  }>;
};

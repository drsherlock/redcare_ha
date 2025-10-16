import { SearchRepositoriesParams } from '../repositories/repositories.type';

export const buildRepoSearchQuery = (p: SearchRepositoriesParams): URLSearchParams => {
  const qualifiers: string[] = [];
  qualifiers.push(`language:${p.language}`);
  qualifiers.push(`created:>=${p.createdAt.slice(0, 10)}`);

  return new URLSearchParams({
    q: qualifiers.join(' '),
    per_page: String(p.pageSize),
    page: String(p.pageNumber),
  });
};

import { SearchRepositoriesParams } from '../repositories/repositories.type';

export const buildRepoSearchQuery = (p: SearchRepositoriesParams): URLSearchParams => {
  const qualifiers: string[] = [];
  if (p.language) qualifiers.push(`language:${p.language}`);
  if (p.createdDate) qualifiers.push(`created:>=${p.createdDate.slice(0, 10)}`);

  return new URLSearchParams({
    q: qualifiers.join(' '),
    per_page: String(p.pageSize ?? 30),
    page: String(p.pageNumber ?? 1),
  });
};

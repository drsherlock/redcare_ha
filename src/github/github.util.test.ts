import { describe, expect, it } from 'vitest';

import { buildRepoSearchQuery } from './github.util';

describe('buildRepoSearchQuery', () => {
  it('should combine multiple qualifiers', () => {
    const params = buildRepoSearchQuery({
      language: 'javascript',
      createdAt: '2023-01-01T00:00:00Z',
      pageNumber: 2,
      pageSize: 50,
    });

    expect(params.get('per_page')).toBe('50');
    expect(params.get('page')).toBe('2');
    expect(params.get('q')).toBe('language:javascript created:>=2023-01-01');
  });
});

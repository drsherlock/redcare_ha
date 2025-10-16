import type { Context } from 'hono';
import { Hono } from 'hono';

import { logger } from '../logger';
import { validateQueryParams } from '../validators/QueryParamsValidator';
import { SearchQueryDto } from './repositories.dto';
import { repositoriesService } from './repositories.service';

export const repositoriesController = new Hono();

repositoriesController.get('/', validateQueryParams(SearchQueryDto), async (c: Context) => {
  logger.info('Getting repositories with the score');

  const dto = c.get('dto') as SearchQueryDto;
  const repositories = await repositoriesService.searchRepositories({ ...dto });

  return c.json(repositories, 200);
});

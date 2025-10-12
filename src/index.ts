import 'reflect-metadata';

import { serve } from '@hono/node-server';
import type { Context } from 'hono';
import { Hono } from 'hono';

import { logger } from './logger';
import { repositoriesController } from './repositories/repositories.controller';

const app = new Hono();

app.get('/health', (c: Context) => c.json({ status: 'running' }));

app.route('/repositories', repositoriesController);

serve({ fetch: app.fetch, port: 4000 }, (address) =>
  logger.info({ port: address.port }, 'API running'),
);

export default app;

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Context, Next } from 'hono';

export const validateQueryParams =
  <T extends object>(Cls: ClassConstructor<T>) =>
  async (c: Context, next: Next) => {
    const raw = c.req.query();
    const dto = plainToInstance(Cls, raw, {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    });

    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length) return c.json({ errors }, 400);

    c.set('dto', dto);
    await next();
  };

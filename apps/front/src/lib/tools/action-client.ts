import { z } from 'zod';

export interface ActionClientOptions {
  baseUrl?: string;
}

export interface ActionMetadata {
  name: string;
  description?: string;
  category?: string;
}

export interface ActionResult<T> {
  data: T;
  metadata?: {
    currency?: string;
    period?: {
      from: string;
      to: string;
    };
  };
}

export type ActionHandler<T, C> = {
  parsedInput: T;
  ctx: C;
};

export function createActionClient() {
  return {
    schema<T extends z.ZodType>(schema: T) {
      return {
        metadata() {
          return {
            action<C>(
              handler: (
                input: ActionHandler<z.infer<T>, C>
              ) => Promise<ActionResult<z.infer<T>>>
            ) {
              return async (input: unknown, ctx: C) => {
                try {
                  const parsedInput = await schema.parseAsync(input);
                  return await handler({ parsedInput, ctx });
                } catch (error) {
                  if (error instanceof z.ZodError) {
                    throw new Error(
                      `Validation error: ${error.errors
                        .map((e) => e.message)
                        .join(", ")}`
                    );
                  }
                  throw error;
                }
              };
            },
          };
        },
      };
    },
  };
} 
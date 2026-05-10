# production MCP HTTP server image (tests run in CI; image build stays slim)
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN pnpm run generate \
    && pnpm exec tsc \
    && pnpm prune --prod

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "dist/http-entry.js"]

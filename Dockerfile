# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22-alpine
ARG PNPM_VERSION=10

FROM node:${NODE_VERSION} AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Build all (simpler for monorepo)
RUN pnpm run build

# ---- RUNTIME ----
FROM node:${NODE_VERSION} AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Copy only runtime deps to keep image smaller
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY package.json .

# Select app at build-time
ARG APP=api
ENV APP=${APP}
CMD ["sh", "-lc", "node dist/apps/${APP}/main.js"]

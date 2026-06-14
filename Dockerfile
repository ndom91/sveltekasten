###########################
#     BASE CONTAINER      #
###########################
FROM node:lts-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable pnpm
RUN corepack enable

###########################
#    BUILDER CONTAINER    #
###########################
FROM base AS build
COPY . /app
WORKDIR /app

RUN mkdir -p /prod/web \
  && mkdir -p /prod/backend
 
# Install openssl for prisma
RUN apt-get update -qq \
  && apt-get install -y openssl git

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate prisma client
RUN cd apps/backend && pnpm exec prisma generate
RUN cd apps/web && pnpm exec prisma generate

RUN pnpm run -r build \
  && pnpm deploy --filter=sveltekasten-web --prod /prod/web \
  && pnpm deploy --filter=sveltekasten-backend --prod /prod/backend

###########################
#      WEB CONTAINER      #
###########################
FROM base AS web

ENV NODE_ENV production
 
# Install openssl for prisma
RUN apt-get update -qq \
  && apt-get install -y openssl

COPY --chown=node:node --from=build /prod/web /prod/web

# Generate prisma client and push db schema
# Pin to the project's prisma version - bare `pnpm dlx prisma` fetches an
# unpinned version whose engine mismatches @prisma/client (missing field
# `enableTracing` panic at runtime).
RUN cd /prod/web \
  && pnpm dlx prisma@7.8.0 generate

WORKDIR /prod/web
EXPOSE ${PORT:-3000}
CMD [ "pnpm", "start" ]

###########################
#    BACKEND CONTAINER    #
###########################
FROM base AS backend

ENV NODE_ENV production

# Install openssl for prisma
RUN apt-get update -qq \
  && apt-get install -y openssl

COPY --chown=node:node --from=build /prod/backend /prod/backend

# Generate prisma client and install playwright chromium + deps
RUN cd /prod/backend \
  && pnpm dlx prisma@7.8.0 generate \
  && pnpm exec playwright install --with-deps chromium

WORKDIR /prod/backend
EXPOSE ${PORT:-8000}
CMD [ "pnpm", "start" ]

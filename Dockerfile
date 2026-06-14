###########################
#     BASE CONTAINER      #
###########################
FROM node:24-bookworm-slim AS base
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
  && pnpm deploy --legacy --filter=sveltekasten-web --prod /prod/web \
  && pnpm deploy --legacy --filter=sveltekasten-backend --prod /prod/backend

###########################
#      WEB CONTAINER      #
###########################
FROM base AS web

ENV NODE_ENV production
 
# Install openssl for prisma
RUN apt-get update -qq \
  && apt-get install -y openssl

COPY --chown=node:node --from=build /prod/web /prod/web

# No prisma generate here: the build stage already generated the client (with
# engineType = "client", Rust-free) and vite bundled it into build/. The prod
# deploy excludes devDeps (prisma + prisma-zod-generator), so regenerating here
# would fail ("prisma-zod-generator: not found") and is unnecessary.

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

# No prisma generate here: the build stage already generated the client (with
# engineType = "client") and tsc compiled it into dist/. The prod deploy
# excludes devDeps (prisma + prisma-zod-generator), so regenerating would fail.
# Only install the Playwright browser the backend needs at runtime.
RUN cd /prod/backend \
  && pnpm exec playwright install --with-deps chromium

WORKDIR /prod/backend
EXPOSE ${PORT:-8000}
CMD [ "pnpm", "start" ]

###########################
#     BASE CONTAINER      #
###########################
FROM node:lts-bookworm-slim AS base
# FROM imbios/bun-node:1.0.33-21.7.1-debian AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

###########################
#    BUILDER CONTAINER    #
###########################
FROM base AS build
COPY . /app
WORKDIR /app

RUN mkdir -p /prod/web && mkdir -p /prod/backend
 
# Install openssl for prisma
RUN apt-get update -qq && \
    apt-get install -y openssl git

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate prisma client
RUN cd apps/backend && pnpm exec prisma generate && pnpm exec prisma generate
RUN cd apps/web && pnpm exec prisma generate

RUN pnpm run -r build

RUN pnpm deploy --filter=sveltekasten-web --prod /prod/web
RUN pnpm deploy --filter=sveltekasten-backend --prod /prod/backend

###########################
#      WEB CONTAINER      #
###########################
FROM base AS web

ENV NODE_ENV production

# Don't run production as root - imbios/bun-node already has node user
# RUN addgroup --system --gid 1001 node
# RUN adduser --system --uid 1001 node
 
# Install openssl for prisma
RUN apt-get update -qq && \
    apt-get install -y openssl

COPY --chown=node:node --from=build /prod/web /prod/web

# Generate prisma client and push db schema
RUN cd /prod/web && pnpm dlx prisma generate

RUN ls -lah /prod/web

WORKDIR /prod/web
EXPOSE ${PORT:-3000}
CMD [ "pnpm", "start" ]

###########################
#    BACKEND CONTAINER    #
###########################
FROM base AS backend

ENV NODE_ENV production

# Don't run production as root - imbios/bun-node already has node user
# RUN addgroup --system --gid 1001 node
# RUN adduser --system --uid 1001 node

# Install openssl for prisma
RUN apt-get update -qq && \
    apt-get install -y openssl

COPY --chown=node:node --from=build /prod/backend /prod/backend

# Generate prisma client
RUN cd /prod/backend && pnpm dlx prisma generate

RUN ls -lah /prod/backend

WORKDIR /prod/backend
EXPOSE ${PORT:-8000}
CMD [ "pnpm", "start" ]

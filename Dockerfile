# FROM node:lts-bookworm-slim AS base
FROM imbios/bun-node:1.0.33-21.7.1-debian AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# RUN corepack enable

FROM base AS build
RUN apt update && apt install -y git openssl
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN mkdir -p /prod/web && mkdir -p /prod/backend

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

RUN pnpm deploy --filter=sveltekasten-web --prod /prod/web
RUN pnpm deploy --filter=sveltekasten-backend --prod /prod/backend

RUN ls -lah /prod/backend
RUN ls -lah /prod/web

FROM base AS web
COPY --from=build /prod/web /prod/web
RUN ls -lah /prod/web
WORKDIR /prod/web
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS backend
COPY --from=build /prod/backend /prod/backend
RUN ls -lah /prod/backend
WORKDIR /prod/backend
RUN ls -lah /prod/backend/dist
EXPOSE 8000
CMD [ "pnpm", "start" ]

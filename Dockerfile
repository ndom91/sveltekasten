# FROM node:lts-bookworm-slim AS base
FROM imbios/bun-node:1.0.33-21.7.1-debian AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN mkdir -p /prod/web && mkdir -p /prod/backend

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

RUN pnpm deploy --filter=sveltekasten-web --prod /prod/web
RUN pnpm deploy --filter=sveltekasten-backend --prod /prod/backend

FROM base AS web
COPY --from=build /prod/web /prod/web
WORKDIR /prod/web
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend
EXPOSE 8000
CMD [ "pnpm", "start" ]

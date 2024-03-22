FROM node:lts-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
RUN apt update && apt install -y git
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN mkdir -p /prod/web && mkdir -p /prod/backend

RUN npm install -g bun

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

RUN pnpm deploy --filter=web --prod /prod/web
RUN pnpm deploy --filter=backend --prod /prod/backend

FROM base AS web
COPY --from=build /prod/web /prod/web
COPY --from=build /usr/src/app/apps/web/package.json /prod/web/
WORKDIR /prod/web
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS backend
COPY --from=build /prod/backend /prod/backend
COPY --from=build /usr/src/app/apps/backend/package.json /prod/backend/
WORKDIR /prod/backend
EXPOSE 8000
CMD [ "pnpm", "start" ]

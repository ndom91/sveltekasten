FROM node:21-alpine AS base
# https://pnpm.io/docker

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV SKIP_ZOD_PRISMA='true'
RUN corepack enable

FROM base AS build
WORKDIR /app
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ADD . ./
RUN pnpm install --frozen-lockfile
RUN pnpm run build && \
  # Remove development dependencies
  pnpm prune --prod

FROM base AS web
COPY --from=build /app /app
WORKDIR /app

RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD [ "dumb-init", "pnpm", "preview", "--", "--port", "3000", "--host" ]

FROM node:21-alpine AS base
# https://pnpm.io/docker

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV SKIP_ZOD_PRISMA=true

RUN corepack enable

FROM base AS build

# Build step env vars
ARG WORKER_URL=${WORKER_URL}

WORKDIR /app
RUN apk add git
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ADD . ./
RUN pnpm install --frozen-lockfile
RUN pnpm run build && \
  # Remove development dependencies
  pnpm prune --prod

FROM base AS web
RUN apk add git dumb-init
COPY --from=build /app /app
WORKDIR /app

RUN chown -R node:node /app
USER node

ENV HOST=0.0.0.0 
ENV PORT=8080 
ENV NODE_ENV=production

EXPOSE 8080
CMD [ "dumb-init", "pnpm", "start"]

# # Briefkasten Web
# 
# FROM node:21-alpine AS base
# # https://pnpm.io/docker
# 
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# ENV SKIP_ZOD_PRISMA=true
# 
# RUN corepack enable
# 
# FROM base AS build
# 
# # Build step env vars
# # ARG WORKER_URL=${WORKER_URL}
# 
# WORKDIR /app
# RUN apk add git
# # RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# ADD . ./
# RUN pnpm install --frozen-lockfile
# RUN pnpm run build && \
  # # Remove development dependencies
  # pnpm prune --prod
# 
# FROM base AS web
# RUN apk add git dumb-init
# COPY --from=build /app /app
# WORKDIR /app
# 
# RUN chown -R node:node /app
# USER node
# 
# ENV NODE_ENV=production
# 
# EXPOSE 3000
# CMD [ "dumb-init", "pnpm", "start"]
#### NEW ATTEMPT ####
FROM node:21-alpine AS base
# 1. Install pnpm
RUN corepack enable

WORKDIR /app

FROM base AS dev
# 2. Install all dependencies and build the package
ARG PACKAGE_PATH
ENV CI=true
ENV SKIP_ZOD_PRISMA=true

COPY . .

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
 pnpm install --filter "{${PACKAGE_PATH:?err}}..." \
 --frozen-lockfile \
 --unsafe-perm \
 | grep -v "cross-device link not permitted\|Falling back to copying packages from store"

RUN pnpm build --if-present --filter "{${PACKAGE_PATH}}^..."
RUN pnpm prune --if-present --filter "{${PACKAGE_PATH}}^..."
RUN rm -rf ${PACKAGE_PATH}src

FROM dev as prod
# 3. Install just prod dependencies
ARG PACKAGE_PATH

RUN chown -R node:node /app
USER node

WORKDIR /app/${PACKAGE_PATH}
EXPOSE 8000
ENV NODE_ENV=production

CMD [ "dumb-init", "pnpm", "start"]

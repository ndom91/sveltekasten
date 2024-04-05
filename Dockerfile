###########################
#     BASE CONTAINER      #
###########################
FROM cgr.dev/chainguard/wolfi-base AS base

RUN mkdir /pnpm

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && apk add --no-cache \
  pnpm \
  nodejs-20 \
  openssl

# Dump default nonroot user and create node:node
RUN deluser nonroot && rm -rf /home/nonroot \
  && addgroup -g 65532 node && adduser -D node -G node -u 65532

###########################
#    BUILDER CONTAINER    #
###########################
FROM base AS build
COPY . /app
WORKDIR /app

RUN mkdir -p /prod/web \
  && mkdir -p /prod/backend
 
RUN apk add --no-cache \
  git \
  python-3.12 \
  make \
  npm \
  playwright \
  chromium

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate prisma client
RUN cd apps/backend && pnpm exec prisma generate && pnpm exec prisma generate
RUN cd apps/web && pnpm exec prisma generate

RUN pnpm run -r build \
  && pnpm deploy --filter=sveltekasten-web --prod /prod/web \
  && pnpm deploy --filter=sveltekasten-backend --prod /prod/backend

###########################
#      WEB CONTAINER      #
###########################
FROM base AS web

ENV NODE_ENV production

# Remove cache and apk binary
RUN rm -rf /var/cache/apk/* && rm /sbin/apk

COPY --chown=node:node --from=build /prod/web /prod/web

# Generate prisma client and push db schema
RUN cd /prod/web \
  && pnpm dlx prisma generate

USER node
WORKDIR /prod/web
EXPOSE ${PORT:-3000}
CMD [ "pnpm", "start" ]

###########################
#    BACKEND CONTAINER    #
###########################
FROM base AS backend

ENV NODE_ENV production

RUN apk add --no-cache \
  playwright \
  chromium

# Remove cache and apk binary
RUN rm -rf /var/cache/apk/* && rm /sbin/apk

COPY --chown=node:node --from=build /prod/backend /prod/backend

# Generate prisma client and install playwright chromium + deps
RUN cd /prod/backend \
  && pnpm dlx prisma generate \
  && pnpm exec playwright install chromium

USER node
WORKDIR /prod/backend
EXPOSE ${PORT:-8000}
CMD [ "pnpm", "start" ]

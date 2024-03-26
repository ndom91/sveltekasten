# Briefkasten in Svelte!

![GitHub issues](https://img.shields.io/github/issues/ndom91/sveltekasten?style=flat-square)
![GitHub](https://img.shields.io/github/license/ndom91/sveltekasten?style=flat-square)
[![Demo](https://img.shields.io/badge/demo-click%20here-brightgreen?style=flat-square)](https://dev.briefkastenhq.com)


<h3 align="center"> <pre>  <br>   🚧 Experimental Svelte rewrite of Briefkasten 🚧   <br>  </pre> </h3>

> [!NOTE]
> This is the **temporary** repository for **Briefkasten V2**. I will move this code to the original `ndom91/briefkasten` repository as we get closer to GA release. However, if you'd like to help out, don't hesitate to file issues here, etc. For more info, check out this [discussion post](https://github.com/ndom91/briefkasten/discussions/65).

### Links: [Beta Instance](https://dev.briefkastenhq.com) | [Docs](https://docs.briefkastenhq.com)

## 🚀 Getting Started

This is setup as a monorepo with (1) `apps/web` being a SvelteKit web application and (2) `apps/backend` being a Hono-based backend service. There are npm scripts in the root `package.json` to control all (most?) things.

1. Clone the repository

```sh
$ git clone git@github.com:ndom91/sveltekasten.git && cd sveltekasten
```

2. Install dependencies

```sh
$ pnpm install
```

This will install the dependencies for both apps.

3. Both `web` and `backend` need separate `.env` files. Copy both `.env.example` files to `.env`, and open them with your favorite text editor to fill in your environment variables.

```sh
$ cd apps/web && cp .env.example .env
$ cd apps/backend && cp .env.example .env
```

In these environment variable files, make sure to at least fill in the `DATABASE_URL`, `AUTH_SECRET`, `JWT_SECRET`, `WORKER_URL` and one [Auth.js](https://authjs.dev) authentication provider, so for example `GITHUB_ID`, `GITHUB_SECRET`. The rest of the environment variables depend on the services / features you want to use.

4. Start the server!

```sh
// First time only
$ pnpm db:push

// dev
$ pnpm dev

// prod
$ pnpm build
$ pnpm start
```

## 🐋 Docker

The Docker setup is still a bit of a WIP, but has been simplified a bit.

1. Run web and backend in the background

```sh
docker compose up -d
```

2. Run web and backend and an additional postgres container

```sh
docker compose up --profile postgres -d
```

3. Run web and backend containers with local code mounted in for development

```sh
docker compose -f docker-compose.local-dev.yml up -d
```

## 👷 Contributing

This project is open to all contributions. Please stick to the repo settings and I'll be happy to take a look at your issue / PR!

**Note that this repository will be nuked relatively soon and all code will be moved to the main `ndom91/briefkasten` repository**

## 📝 License

MIT

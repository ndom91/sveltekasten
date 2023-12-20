# Briefkasten in Svelte!

![GitHub deployments](https://img.shields.io/github/deployments/ndom91/briefkasten/production?label=ci%2Fcd&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/ndom91/briefkasten?style=flat-square)
![Checkly](https://api.checklyhq.com/v1/badges/checks/9c682653-d7de-4e32-8183-73d76631b0e2?style=flat-square&responseTime=false)
![GitHub](https://img.shields.io/github/license/ndom91/briefkasten?style=flat-square)
[![Demo](https://img.shields.io/badge/demo-click%20here-brightgreen?style=flat-square)](https://briefkastenhq.com)

🚧 Experimental Svelte rewrite of [Briefkasten](https://github.com/ndom91/briefkasten).

> Self-hosted bookmarking application. Works with any Prisma compatible database (MySQL, Postgres, SQLite, etc.)

## 🚀 Getting Started

1. Clone the repository

```sh
$ git clone git@github.com:ndom91/sveltekasten.git && cd sveltekasten
```

2. Install dependencies

```sh
$ pnpm install
```

3. Copy the `.env.example` file to `.env`, and open it with your favorite text editor to fill in your environment variables.

```sh
$ cp .env.example .env
$ vim .env
```

In this environment variables file, make sure to at least fill in the `DATABASE_URL`, `NEXTAUTH_URL` and `NEXTAUTH_SECRET`. The rest of the environment variables depend on the services / features you want to use. For example, Google/Github for OAuth login and/or Supabase for object storage.

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

## 👷 Contributing

This project is open to any and all contributions! Please stick to the ESLint / Prettier settings and I'll be happy to take a look at your issue / PR 😀

## 📝 License

MIT

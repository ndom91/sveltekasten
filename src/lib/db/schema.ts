import { sql } from "drizzle-orm"
import { integer, sqliteTable, index, unique, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createId } from "@paralleldrive/cuid2"
import type { AdapterAccount } from "@auth/core/adapters"

// Auth.js
export const users = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)

// Briefkasten

export const bookmarks = sqliteTable(
  "bookmark",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text("title").notNull(),
    url: text("url").notNull(),
    image: text("image"),
    imageBlur: text("image"),
    desc: text("desc"),
    category: text("category"),
    metadata: text("metadata", { mode: "json" }),
    archived: integer("archived", { mode: "boolean" }).default(false),
    categoryId: text("categoryId").references(() => categories.id, { onDelete: "set null" }),
    userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
  },
  (t) => ({
    uniqueUserUrl: unique().on(t.url, t.userId),
    categoryIdx: index("category_idx").on(t.categoryId),
    userIdx: index("user_idx").on(t.userId),
  }),
)

export const tags = sqliteTable(
  "tag",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    description: text("description"),
    userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
  },
  (t) => ({
    uniqueNameUser: unique().on(t.name, t.userId),
    userIdx: index("user_idx").on(t.userId),
  }),
)

export const tagsToBookmarks = sqliteTable("tagsToBookmarks", {
  bookmarkId: text("bookmark_id")
    .notNull()
    .references(() => bookmarks.id),
  tagId: text("tagId")
    .notNull()
    .references(() => tags.id),
})

export const categories = sqliteTable(
  "category",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    description: text("description"),
    userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
  },
  (t) => ({
    uniqueNameUser: unique().on(t.name, t.userId),
    userIdx: index("user_idx").on(t.userId),
  }),
)

export const feeds = sqliteTable(
  "feed",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    language: text("language"),
    copyright: text("copyright"),
    userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    lastFetched: integer("lastFetched", { mode: "timestamp_ms" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
  },
  (t) => ({
    uniqueUrlUser: unique().on(t.url, t.userId),
    userIdx: index("user_idx").on(t.userId),
  }),
)

export const feedEntries = sqliteTable(
  "feedEntry",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    guid: text("guid"),
    text: text("text").notNull(),
    link: text("link").notNull(),
    content: text("content"),
    contentSnippet: text("contentSnippet"),
    author: text("author"),
    ingested: integer("ingested", { mode: "timestamp_ms" }),
    published: integer("published", { mode: "timestamp_ms" }),
    published: integer("published", { mode: "timestamp_ms" }),
    unread: integer("unread", { mode: "boolean" }).default(true),
    categoriers: text("metadata", { mode: "json" }),
    feedId: text("feedId").references(() => feeds.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
  },
  (t) => ({
    guidIdx: index("guid_idx").on(t.guid),
    userIdx: index("user_idx").on(t.userId),
    feedIdx: index("feed_idx").on(t.feedId),
  }),
)

export const feedEntryMedia = sqliteTable(
  "feedEntryMedia",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    href: text("href").notNull(),
    title: text("title"),
    medium: text("medium"),
    height: integer("height"),
    width: integer("width"),
    description: text("description"),
    credit: text("credit"),
    feedEntryId: text("feedEntryId").references(() => feedEntries.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
  },
  (t) => ({
    userIdx: index("user_idx").on(t.userId),
    feedEntryIdx: index("feed_entry_idx").on(t.feedEntryId),
  }),
)

// Migration notes:
// - bookmarks.desc -> description
// - tags.emoji -> description
// - updatedAt / createdAt -> unix ms timestamp

import { sql } from "drizzle-orm"
import { integer, sqliteTable, index, unique, text } from "drizzle-orm/sqlite-core"
import { createId } from "@paralleldrive/cuid2"
import { users } from "./auth"

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

export type Feed = typeof feeds.$inferSelect
export type InsertFeed = typeof feeds.$inferInsert

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

export type FeedEntry = typeof feedEntries.$inferSelect
export type InsertFeedEntry = typeof feedEntries.$inferInsert

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

export type FeedEntryMedia = typeof feedEntryMedia.$inferSelect
export type InsertFeedEntryMedia = typeof feedEntryMedia.$inferInsert

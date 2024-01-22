import { sql } from "drizzle-orm"
import { integer, sqliteTable, index, unique, text } from "drizzle-orm/sqlite-core"
import { createId } from "@paralleldrive/cuid2"
import { users } from "./auth"

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
    userIdx: index("bookmarks_user_idx").on(t.userId),
  }),
)

export type Bookmark = typeof bookmarks.$inferSelect
export type InsertBookmark = typeof bookmarks.$inferInsert

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
    userIdx: index("tags_user_idx").on(t.userId),
  }),
)

export type Tag = typeof tags.$inferSelect
export type InsertTag = typeof tags.$inferInsert

export const tagsToBookmarks = sqliteTable("tagsToBookmarks", {
  bookmarkId: text("bookmark_id")
    .notNull()
    .references(() => bookmarks.id),
  tagId: text("tagId")
    .notNull()
    .references(() => tags.id),
})

export type TagOnBookmark = typeof tagsToBookmarks.$inferSelect
export type InsertTagOnBookmark = typeof tagsToBookmarks.$inferInsert

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
    userIdx: index("categories_user_idx").on(t.userId),
  }),
)

export type Category = typeof categories.$inferSelect
export type InsertCategory = typeof categories.$inferInsert

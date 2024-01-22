import { sql } from "drizzle-orm"
import { integer, sqliteTable, index, unique, text } from "drizzle-orm/sqlite-core"
import { createId } from "@paralleldrive/cuid2"
import { users } from "./auth"

export const bookmark = sqliteTable(
  "bookmark",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text("title").notNull(),
    url: text("url").notNull(),
    image: text("image"),
    imageBlur: text("imageBlur"),
    description: text("description"),
    category: text("category"),
    metadata: text("metadata", { mode: "json" }),
    archived: integer("archived", { mode: "boolean" }).default(false),
    categoryId: text("categoryId").references(() => category.id, { onDelete: "set null" }),
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

export type Bookmark = typeof bookmark.$inferSelect
export type InsertBookmark = typeof bookmark.$inferInsert

export const tag = sqliteTable(
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

export type Tag = typeof tag.$inferSelect
export type InsertTag = typeof tag.$inferInsert

export const tagToBookmark = sqliteTable("tagsToBookmarks", {
  bookmarkId: text("bookmarkId")
    .notNull()
    .references(() => bookmark.id),
  tagId: text("tagId")
    .notNull()
    .references(() => tag.id),
})

export type TagOnBookmark = typeof tagToBookmark.$inferSelect
export type InsertTagOnBookmark = typeof tagToBookmark.$inferInsert

export const category = sqliteTable(
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

export type Category = typeof category.$inferSelect
export type InsertCategory = typeof category.$inferInsert

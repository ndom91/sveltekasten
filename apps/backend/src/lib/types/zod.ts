import { z } from "zod"
import { Prisma } from "../../prisma-client/client.js"

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | "JsonNull" | "DbNull"

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === "DbNull") return Prisma.DbNull
  if (v === "JsonNull") return Prisma.JsonNull
  return v
}

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
)

export type JsonValueType = z.infer<typeof JsonValueSchema>

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal("DbNull"), z.literal("JsonNull")])
  .nullable()
  .transform((v) => transformJsonNull(v))

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
)

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable",
])

export const AccountScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "type",
  "provider",
  "providerAccountId",
  "refresh_token",
  "access_token",
  "expires_at",
  "token_type",
  "scope",
  "id_token",
  "session_state",
  "createdAt",
  "updatedAt",
])

export const UserScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "email",
  "emailVerified",
  "image",
  "settings",
  "createdAt",
])

export const SessionScalarFieldEnumSchema = z.enum(["id", "sessionToken", "userId", "expires"])

export const VerificationTokenScalarFieldEnumSchema = z.enum(["identifier", "token", "expires"])

export const BookmarkScalarFieldEnumSchema = z.enum([
  "id",
  "title",
  "url",
  "image",
  "imageBlur",
  "desc",
  "categoryId",
  "metadata",
  "archived",
  "userId",
  "createdAt",
  "updatedAt",
])

export const TagsOnBookmarksScalarFieldEnumSchema = z.enum(["bookmarkId", "tagId"])

export const TagScalarFieldEnumSchema = z.enum(["id", "name", "userId", "createdAt", "updatedAt"])

export const CategoryScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "description",
  "userId",
  "createdAt",
  "updatedAt",
])

export const FeedScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "url",
  "description",
  "language",
  "copyright",
  "userId",
  "lastFetched",
  "createdAt",
  "updatedAt",
])

export const FeedEntryScalarFieldEnumSchema = z.enum([
  "id",
  "guid",
  "title",
  "link",
  "content",
  "contentSnippet",
  "author",
  "ingested",
  "published",
  "unread",
  "categories",
  "feedId",
  "userId",
  "createdAt",
  "updatedAt",
])

export const FeedEntryMediaScalarFieldEnumSchema = z.enum([
  "id",
  "href",
  "title",
  "feedEntryId",
  "userId",
  "createdAt",
  "updatedAt",
])

export const SortOrderSchema = z.enum(["asc", "desc"])

export const NullableJsonNullValueInputSchema = z
  .enum(["DbNull", "JsonNull"])
  .transform((value) =>
    value === "JsonNull" ? Prisma.JsonNull : value === "DbNull" ? Prisma.DbNull : value
  )

export const QueryModeSchema = z.enum(["default", "insensitive"])

export const NullsOrderSchema = z.enum(["first", "last"])

export const AccountOrderByRelevanceFieldEnumSchema = z.enum([
  "id",
  "userId",
  "type",
  "provider",
  "providerAccountId",
  "refresh_token",
  "access_token",
  "token_type",
  "scope",
  "id_token",
  "session_state",
])

export const JsonNullValueFilterSchema = z
  .enum(["DbNull", "JsonNull", "AnyNull"])
  .transform((value) =>
    value === "JsonNull"
      ? Prisma.JsonNull
      : value === "DbNull"
        ? Prisma.JsonNull
        : value === "AnyNull"
          ? Prisma.AnyNull
          : value
  )

export const UserOrderByRelevanceFieldEnumSchema = z.enum(["id", "name", "email", "image"])

export const SessionOrderByRelevanceFieldEnumSchema = z.enum(["id", "sessionToken", "userId"])

export const VerificationTokenOrderByRelevanceFieldEnumSchema = z.enum(["identifier", "token"])

export const BookmarkOrderByRelevanceFieldEnumSchema = z.enum([
  "id",
  "title",
  "url",
  "image",
  "imageBlur",
  "desc",
  "categoryId",
  "userId",
])

export const TagsOnBookmarksOrderByRelevanceFieldEnumSchema = z.enum(["bookmarkId", "tagId"])

export const TagOrderByRelevanceFieldEnumSchema = z.enum(["id", "name", "userId"])

export const CategoryOrderByRelevanceFieldEnumSchema = z.enum([
  "id",
  "name",
  "description",
  "userId",
])

export const FeedOrderByRelevanceFieldEnumSchema = z.enum([
  "id",
  "name",
  "url",
  "description",
  "language",
  "copyright",
  "userId",
])

export const FeedEntryOrderByRelevanceFieldEnumSchema = z.enum([
  "id",
  "guid",
  "title",
  "link",
  "content",
  "contentSnippet",
  "author",
  "categories",
  "feedId",
  "userId",
])

export const FeedEntryMediaOrderByRelevanceFieldEnumSchema = z.enum([
  "id",
  "href",
  "title",
  "feedEntryId",
  "userId",
])
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  settings: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// BOOKMARK SCHEMA
/////////////////////////////////////////

export const BookmarkSchema = z.object({
  id: z.string().cuid(),
  title: z.string().nullable(),
  url: z.string(),
  image: z.string().nullable(),
  imageBlur: z.string().nullable(),
  desc: z.string().nullable(),
  categoryId: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
  archived: z.boolean(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Bookmark = z.infer<typeof BookmarkSchema>

/////////////////////////////////////////
// TAGS ON BOOKMARKS SCHEMA
/////////////////////////////////////////

export const TagsOnBookmarksSchema = z.object({
  bookmarkId: z.string(),
  tagId: z.string(),
})

export type TagsOnBookmarks = z.infer<typeof TagsOnBookmarksSchema>

/////////////////////////////////////////
// TAG SCHEMA
/////////////////////////////////////////

export const TagSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Tag = z.infer<typeof TagSchema>

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Category = z.infer<typeof CategorySchema>

/////////////////////////////////////////
// FEED SCHEMA
/////////////////////////////////////////

export const FeedSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  url: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  copyright: z.string().nullable(),
  userId: z.string(),
  lastFetched: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Feed = z.infer<typeof FeedSchema>

/////////////////////////////////////////
// FEED ENTRY SCHEMA
/////////////////////////////////////////

export const FeedEntrySchema = z.object({
  id: z.string().cuid(),
  guid: z.string().nullable(),
  title: z.string(),
  link: z.string(),
  content: z.string().nullable(),
  contentSnippet: z.string().nullable(),
  author: z.string().nullable(),
  ingested: z.coerce.date().nullable(),
  published: z.coerce.date().nullable(),
  unread: z.boolean(),
  categories: z.string().array(),
  feedId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FeedEntry = z.infer<typeof FeedEntrySchema>

/////////////////////////////////////////
// FEED ENTRY MEDIA SCHEMA
/////////////////////////////////////////

export const FeedEntryMediaSchema = z.object({
  id: z.string().cuid(),
  href: z.string(),
  title: z.string().nullable(),
  feedEntryId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FeedEntryMedia = z.infer<typeof FeedEntryMediaSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z
  .object({
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z
  .object({
    select: z.lazy(() => AccountSelectSchema).optional(),
    include: z.lazy(() => AccountIncludeSchema).optional(),
  })
  .strict()

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z
  .object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    type: z.boolean().optional(),
    provider: z.boolean().optional(),
    providerAccountId: z.boolean().optional(),
    refresh_token: z.boolean().optional(),
    access_token: z.boolean().optional(),
    expires_at: z.boolean().optional(),
    token_type: z.boolean().optional(),
    scope: z.boolean().optional(),
    id_token: z.boolean().optional(),
    session_state: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z
  .object({
    accounts: z.union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)]).optional(),
    sessions: z.union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)]).optional(),
    bookmarks: z.union([z.boolean(), z.lazy(() => BookmarkFindManyArgsSchema)]).optional(),
    tags: z.union([z.boolean(), z.lazy(() => TagFindManyArgsSchema)]).optional(),
    feeds: z.union([z.boolean(), z.lazy(() => FeedFindManyArgsSchema)]).optional(),
    feedEntries: z.union([z.boolean(), z.lazy(() => FeedEntryFindManyArgsSchema)]).optional(),
    feedMedia: z.union([z.boolean(), z.lazy(() => FeedEntryMediaFindManyArgsSchema)]).optional(),
    categories: z.union([z.boolean(), z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z
  .object({
    select: z.lazy(() => UserSelectSchema).optional(),
    include: z.lazy(() => UserIncludeSchema).optional(),
  })
  .strict()

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z
  .object({
    select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
  })
  .strict()

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z
  .object({
    accounts: z.boolean().optional(),
    sessions: z.boolean().optional(),
    bookmarks: z.boolean().optional(),
    tags: z.boolean().optional(),
    feeds: z.boolean().optional(),
    feedEntries: z.boolean().optional(),
    feedMedia: z.boolean().optional(),
    categories: z.boolean().optional(),
  })
  .strict()

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    emailVerified: z.boolean().optional(),
    image: z.boolean().optional(),
    settings: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    accounts: z.union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)]).optional(),
    sessions: z.union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)]).optional(),
    bookmarks: z.union([z.boolean(), z.lazy(() => BookmarkFindManyArgsSchema)]).optional(),
    tags: z.union([z.boolean(), z.lazy(() => TagFindManyArgsSchema)]).optional(),
    feeds: z.union([z.boolean(), z.lazy(() => FeedFindManyArgsSchema)]).optional(),
    feedEntries: z.union([z.boolean(), z.lazy(() => FeedEntryFindManyArgsSchema)]).optional(),
    feedMedia: z.union([z.boolean(), z.lazy(() => FeedEntryMediaFindManyArgsSchema)]).optional(),
    categories: z.union([z.boolean(), z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z
  .object({
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z
  .object({
    select: z.lazy(() => SessionSelectSchema).optional(),
    include: z.lazy(() => SessionIncludeSchema).optional(),
  })
  .strict()

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z
  .object({
    id: z.boolean().optional(),
    sessionToken: z.boolean().optional(),
    userId: z.boolean().optional(),
    expires: z.boolean().optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z
  .object({
    identifier: z.boolean().optional(),
    token: z.boolean().optional(),
    expires: z.boolean().optional(),
  })
  .strict()

// BOOKMARK
//------------------------------------------------------

export const BookmarkIncludeSchema: z.ZodType<Prisma.BookmarkInclude> = z
  .object({
    category: z.union([z.boolean(), z.lazy(() => CategoryArgsSchema)]).optional(),
    tags: z.union([z.boolean(), z.lazy(() => TagsOnBookmarksFindManyArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => BookmarkCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

export const BookmarkArgsSchema: z.ZodType<Prisma.BookmarkDefaultArgs> = z
  .object({
    select: z.lazy(() => BookmarkSelectSchema).optional(),
    include: z.lazy(() => BookmarkIncludeSchema).optional(),
  })
  .strict()

export const BookmarkCountOutputTypeArgsSchema: z.ZodType<Prisma.BookmarkCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => BookmarkCountOutputTypeSelectSchema).nullish(),
    })
    .strict()

export const BookmarkCountOutputTypeSelectSchema: z.ZodType<Prisma.BookmarkCountOutputTypeSelect> =
  z
    .object({
      tags: z.boolean().optional(),
    })
    .strict()

export const BookmarkSelectSchema: z.ZodType<Prisma.BookmarkSelect> = z
  .object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    image: z.boolean().optional(),
    imageBlur: z.boolean().optional(),
    desc: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    metadata: z.boolean().optional(),
    archived: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    category: z.union([z.boolean(), z.lazy(() => CategoryArgsSchema)]).optional(),
    tags: z.union([z.boolean(), z.lazy(() => TagsOnBookmarksFindManyArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => BookmarkCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

// TAGS ON BOOKMARKS
//------------------------------------------------------

export const TagsOnBookmarksIncludeSchema: z.ZodType<Prisma.TagsOnBookmarksInclude> = z
  .object({
    bookmark: z.union([z.boolean(), z.lazy(() => BookmarkArgsSchema)]).optional(),
    tag: z.union([z.boolean(), z.lazy(() => TagArgsSchema)]).optional(),
  })
  .strict()

export const TagsOnBookmarksArgsSchema: z.ZodType<Prisma.TagsOnBookmarksDefaultArgs> = z
  .object({
    select: z.lazy(() => TagsOnBookmarksSelectSchema).optional(),
    include: z.lazy(() => TagsOnBookmarksIncludeSchema).optional(),
  })
  .strict()

export const TagsOnBookmarksSelectSchema: z.ZodType<Prisma.TagsOnBookmarksSelect> = z
  .object({
    bookmarkId: z.boolean().optional(),
    tagId: z.boolean().optional(),
    bookmark: z.union([z.boolean(), z.lazy(() => BookmarkArgsSchema)]).optional(),
    tag: z.union([z.boolean(), z.lazy(() => TagArgsSchema)]).optional(),
  })
  .strict()

// TAG
//------------------------------------------------------

export const TagIncludeSchema: z.ZodType<Prisma.TagInclude> = z
  .object({
    bookmarks: z.union([z.boolean(), z.lazy(() => TagsOnBookmarksFindManyArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

export const TagArgsSchema: z.ZodType<Prisma.TagDefaultArgs> = z
  .object({
    select: z.lazy(() => TagSelectSchema).optional(),
    include: z.lazy(() => TagIncludeSchema).optional(),
  })
  .strict()

export const TagCountOutputTypeArgsSchema: z.ZodType<Prisma.TagCountOutputTypeDefaultArgs> = z
  .object({
    select: z.lazy(() => TagCountOutputTypeSelectSchema).nullish(),
  })
  .strict()

export const TagCountOutputTypeSelectSchema: z.ZodType<Prisma.TagCountOutputTypeSelect> = z
  .object({
    bookmarks: z.boolean().optional(),
  })
  .strict()

export const TagSelectSchema: z.ZodType<Prisma.TagSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    bookmarks: z.union([z.boolean(), z.lazy(() => TagsOnBookmarksFindManyArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z
  .object({
    bookmarks: z.union([z.boolean(), z.lazy(() => BookmarkFindManyArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z
  .object({
    select: z.lazy(() => CategorySelectSchema).optional(),
    include: z.lazy(() => CategoryIncludeSchema).optional(),
  })
  .strict()

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
    })
    .strict()

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> =
  z
    .object({
      bookmarks: z.boolean().optional(),
    })
    .strict()

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    bookmarks: z.union([z.boolean(), z.lazy(() => BookmarkFindManyArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

// FEED
//------------------------------------------------------

export const FeedIncludeSchema: z.ZodType<Prisma.FeedInclude> = z
  .object({
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    feedEntries: z.union([z.boolean(), z.lazy(() => FeedEntryFindManyArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => FeedCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

export const FeedArgsSchema: z.ZodType<Prisma.FeedDefaultArgs> = z
  .object({
    select: z.lazy(() => FeedSelectSchema).optional(),
    include: z.lazy(() => FeedIncludeSchema).optional(),
  })
  .strict()

export const FeedCountOutputTypeArgsSchema: z.ZodType<Prisma.FeedCountOutputTypeDefaultArgs> = z
  .object({
    select: z.lazy(() => FeedCountOutputTypeSelectSchema).nullish(),
  })
  .strict()

export const FeedCountOutputTypeSelectSchema: z.ZodType<Prisma.FeedCountOutputTypeSelect> = z
  .object({
    feedEntries: z.boolean().optional(),
  })
  .strict()

export const FeedSelectSchema: z.ZodType<Prisma.FeedSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    url: z.boolean().optional(),
    description: z.boolean().optional(),
    language: z.boolean().optional(),
    copyright: z.boolean().optional(),
    userId: z.boolean().optional(),
    lastFetched: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    feedEntries: z.union([z.boolean(), z.lazy(() => FeedEntryFindManyArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => FeedCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

// FEED ENTRY
//------------------------------------------------------

export const FeedEntryIncludeSchema: z.ZodType<Prisma.FeedEntryInclude> = z
  .object({
    feed: z.union([z.boolean(), z.lazy(() => FeedArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    feedMedia: z.union([z.boolean(), z.lazy(() => FeedEntryMediaFindManyArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => FeedEntryCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

export const FeedEntryArgsSchema: z.ZodType<Prisma.FeedEntryDefaultArgs> = z
  .object({
    select: z.lazy(() => FeedEntrySelectSchema).optional(),
    include: z.lazy(() => FeedEntryIncludeSchema).optional(),
  })
  .strict()

export const FeedEntryCountOutputTypeArgsSchema: z.ZodType<Prisma.FeedEntryCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => FeedEntryCountOutputTypeSelectSchema).nullish(),
    })
    .strict()

export const FeedEntryCountOutputTypeSelectSchema: z.ZodType<Prisma.FeedEntryCountOutputTypeSelect> =
  z
    .object({
      feedMedia: z.boolean().optional(),
    })
    .strict()

export const FeedEntrySelectSchema: z.ZodType<Prisma.FeedEntrySelect> = z
  .object({
    id: z.boolean().optional(),
    guid: z.boolean().optional(),
    title: z.boolean().optional(),
    link: z.boolean().optional(),
    content: z.boolean().optional(),
    contentSnippet: z.boolean().optional(),
    author: z.boolean().optional(),
    ingested: z.boolean().optional(),
    published: z.boolean().optional(),
    unread: z.boolean().optional(),
    categories: z.boolean().optional(),
    feedId: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    feed: z.union([z.boolean(), z.lazy(() => FeedArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
    feedMedia: z.union([z.boolean(), z.lazy(() => FeedEntryMediaFindManyArgsSchema)]).optional(),
    _count: z.union([z.boolean(), z.lazy(() => FeedEntryCountOutputTypeArgsSchema)]).optional(),
  })
  .strict()

// FEED ENTRY MEDIA
//------------------------------------------------------

export const FeedEntryMediaIncludeSchema: z.ZodType<Prisma.FeedEntryMediaInclude> = z
  .object({
    feedEntry: z.union([z.boolean(), z.lazy(() => FeedEntryArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict()

export const FeedEntryMediaArgsSchema: z.ZodType<Prisma.FeedEntryMediaDefaultArgs> = z
  .object({
    select: z.lazy(() => FeedEntryMediaSelectSchema).optional(),
    include: z.lazy(() => FeedEntryMediaIncludeSchema).optional(),
  })
  .strict()

export const FeedEntryMediaSelectSchema: z.ZodType<Prisma.FeedEntryMediaSelect> = z
  .object({
    id: z.boolean().optional(),
    href: z.boolean().optional(),
    title: z.boolean().optional(),
    feedEntryId: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    feedEntry: z.union([z.boolean(), z.lazy(() => FeedEntryArgsSchema)]).optional(),
    user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
  })
  .strict()

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z
  .object({
    AND: z
      .union([z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array()])
      .optional(),
    OR: z
      .lazy(() => AccountWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array()])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    provider: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    providerAccountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    refresh_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    access_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    expires_at: z
      .union([z.lazy(() => IntNullableFilterSchema), z.number()])
      .optional()
      .nullable(),
    token_type: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    scope: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    id_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    session_state: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    user: z
      .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.AccountWhereInput>

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      access_token: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      expires_at: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      token_type: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      scope: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      id_token: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      session_state: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
      _relevance: z.lazy(() => AccountOrderByRelevanceInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.AccountOrderByWithRelationInput>

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z
  .union([
    z.object({
      id: z.string().cuid(),
      provider_providerAccountId: z.lazy(
        () => AccountProviderProviderAccountIdCompoundUniqueInputSchema
      ),
    }),
    z.object({
      id: z.string().cuid(),
    }),
    z.object({
      provider_providerAccountId: z.lazy(
        () => AccountProviderProviderAccountIdCompoundUniqueInputSchema
      ),
    }),
  ])
  .and(
    z
      .object({
        id: z.string().cuid().optional(),
        provider_providerAccountId: z
          .lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema)
          .optional(),
        AND: z
          .union([
            z.lazy(() => AccountWhereInputSchema),
            z.lazy(() => AccountWhereInputSchema).array(),
          ])
          .optional(),
        OR: z
          .lazy(() => AccountWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([
            z.lazy(() => AccountWhereInputSchema),
            z.lazy(() => AccountWhereInputSchema).array(),
          ])
          .optional(),
        userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        provider: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        providerAccountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        refresh_token: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        access_token: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        expires_at: z
          .union([z.lazy(() => IntNullableFilterSchema), z.number().int()])
          .optional()
          .nullable(),
        token_type: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        scope: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        id_token: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        session_state: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        user: z
          .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
          .optional(),
      })
      .strict()
  ) as z.ZodType<Prisma.AccountWhereUniqueInput>

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      access_token: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      expires_at: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      token_type: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      scope: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      id_token: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      session_state: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
      _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.AccountOrderByWithAggregationInput>

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),
          z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => AccountScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),
          z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      type: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      provider: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      providerAccountId: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      refresh_token: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      access_token: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      expires_at: z
        .union([z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number()])
        .optional()
        .nullable(),
      token_type: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      scope: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      id_token: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      session_state: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput>

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z
  .object({
    AND: z
      .union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
      .optional(),
    OR: z
      .lazy(() => UserWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    email: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    emailVerified: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    image: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    settings: z.lazy(() => JsonNullableFilterSchema).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
    sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
    bookmarks: z.lazy(() => BookmarkListRelationFilterSchema).optional(),
    tags: z.lazy(() => TagListRelationFilterSchema).optional(),
    feeds: z.lazy(() => FeedListRelationFilterSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryListRelationFilterSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaListRelationFilterSchema).optional(),
    categories: z.lazy(() => CategoryListRelationFilterSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserWhereInput>

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
    email: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
    emailVerified: z
      .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
      .optional(),
    image: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
    settings: z
      .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
      .optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
    sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkOrderByRelationAggregateInputSchema).optional(),
    tags: z.lazy(() => TagOrderByRelationAggregateInputSchema).optional(),
    feeds: z.lazy(() => FeedOrderByRelationAggregateInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryOrderByRelationAggregateInputSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaOrderByRelationAggregateInputSchema).optional(),
    categories: z.lazy(() => CategoryOrderByRelationAggregateInputSchema).optional(),
    _relevance: z.lazy(() => UserOrderByRelevanceInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserOrderByWithRelationInput>

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z
  .union([
    z.object({
      id: z.string().cuid(),
      email: z.string(),
    }),
    z.object({
      id: z.string().cuid(),
    }),
    z.object({
      email: z.string(),
    }),
  ])
  .and(
    z
      .object({
        id: z.string().cuid().optional(),
        email: z.string().optional(),
        AND: z
          .union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
          .optional(),
        OR: z
          .lazy(() => UserWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
          .optional(),
        name: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        emailVerified: z
          .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
          .optional()
          .nullable(),
        image: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        settings: z.lazy(() => JsonNullableFilterSchema).optional(),
        createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
        sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
        bookmarks: z.lazy(() => BookmarkListRelationFilterSchema).optional(),
        tags: z.lazy(() => TagListRelationFilterSchema).optional(),
        feeds: z.lazy(() => FeedListRelationFilterSchema).optional(),
        feedEntries: z.lazy(() => FeedEntryListRelationFilterSchema).optional(),
        feedMedia: z.lazy(() => FeedEntryMediaListRelationFilterSchema).optional(),
        categories: z.lazy(() => CategoryListRelationFilterSchema).optional(),
      })
      .strict()
  ) as z.ZodType<Prisma.UserWhereUniqueInput>

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
      email: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      emailVerified: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      image: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      settings: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserOrderByWithAggregationInput>

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
          z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => UserScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
          z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      name: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      email: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      image: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      settings: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserScalarWhereWithAggregatesInput>

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z
  .object({
    AND: z
      .union([z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array()])
      .optional(),
    OR: z
      .lazy(() => SessionWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array()])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    sessionToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    expires: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    user: z
      .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.SessionWhereInput>

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
      _relevance: z.lazy(() => SessionOrderByRelevanceInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.SessionOrderByWithRelationInput>

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z
  .union([
    z.object({
      id: z.string().cuid(),
      sessionToken: z.string(),
    }),
    z.object({
      id: z.string().cuid(),
    }),
    z.object({
      sessionToken: z.string(),
    }),
  ])
  .and(
    z
      .object({
        id: z.string().cuid().optional(),
        sessionToken: z.string().optional(),
        AND: z
          .union([
            z.lazy(() => SessionWhereInputSchema),
            z.lazy(() => SessionWhereInputSchema).array(),
          ])
          .optional(),
        OR: z
          .lazy(() => SessionWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([
            z.lazy(() => SessionWhereInputSchema),
            z.lazy(() => SessionWhereInputSchema).array(),
          ])
          .optional(),
        userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        expires: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        user: z
          .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
          .optional(),
      })
      .strict()
  ) as z.ZodType<Prisma.SessionWhereUniqueInput>

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.SessionOrderByWithAggregationInput>

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),
          z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => SessionScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),
          z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      sessionToken: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      expires: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput>

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => VerificationTokenWhereInputSchema),
        z.lazy(() => VerificationTokenWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => VerificationTokenWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => VerificationTokenWhereInputSchema),
        z.lazy(() => VerificationTokenWhereInputSchema).array(),
      ])
      .optional(),
    identifier: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    expires: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  })
  .strict() as z.ZodType<Prisma.VerificationTokenWhereInput>

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      _relevance: z.lazy(() => VerificationTokenOrderByRelevanceInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput>

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> =
  z
    .union([
      z.object({
        token: z.string(),
        identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema),
      }),
      z.object({
        token: z.string(),
      }),
      z.object({
        identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema),
      }),
    ])
    .and(
      z
        .object({
          token: z.string().optional(),
          identifier_token: z
            .lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema)
            .optional(),
          AND: z
            .union([
              z.lazy(() => VerificationTokenWhereInputSchema),
              z.lazy(() => VerificationTokenWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => VerificationTokenWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => VerificationTokenWhereInputSchema),
              z.lazy(() => VerificationTokenWhereInputSchema).array(),
            ])
            .optional(),
          identifier: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
          expires: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        })
        .strict()
    ) as z.ZodType<Prisma.VerificationTokenWhereUniqueInput>

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput>

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),
          z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),
          z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      identifier: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      token: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      expires: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput>

export const BookmarkWhereInputSchema: z.ZodType<Prisma.BookmarkWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => BookmarkWhereInputSchema),
        z.lazy(() => BookmarkWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => BookmarkWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => BookmarkWhereInputSchema),
        z.lazy(() => BookmarkWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    title: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    url: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    image: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    imageBlur: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    desc: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    categoryId: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
    archived: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    category: z
      .union([
        z.lazy(() => CategoryNullableScalarRelationFilterSchema),
        z.lazy(() => CategoryWhereInputSchema),
      ])
      .optional()
      .nullable(),
    tags: z.lazy(() => TagsOnBookmarksListRelationFilterSchema).optional(),
    user: z
      .union([
        z.lazy(() => UserNullableScalarRelationFilterSchema),
        z.lazy(() => UserWhereInputSchema),
      ])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.BookmarkWhereInput>

export const BookmarkOrderByWithRelationInputSchema: z.ZodType<Prisma.BookmarkOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      title: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      url: z.lazy(() => SortOrderSchema).optional(),
      image: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      imageBlur: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      desc: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
      categoryId: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      metadata: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      archived: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional(),
      tags: z.lazy(() => TagsOnBookmarksOrderByRelationAggregateInputSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
      _relevance: z.lazy(() => BookmarkOrderByRelevanceInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkOrderByWithRelationInput>

export const BookmarkWhereUniqueInputSchema: z.ZodType<Prisma.BookmarkWhereUniqueInput> = z
  .union([
    z.object({
      id: z.string().cuid(),
      url_userId: z.lazy(() => BookmarkUrlUserIdCompoundUniqueInputSchema),
    }),
    z.object({
      id: z.string().cuid(),
    }),
    z.object({
      url_userId: z.lazy(() => BookmarkUrlUserIdCompoundUniqueInputSchema),
    }),
  ])
  .and(
    z
      .object({
        id: z.string().cuid().optional(),
        url_userId: z.lazy(() => BookmarkUrlUserIdCompoundUniqueInputSchema).optional(),
        AND: z
          .union([
            z.lazy(() => BookmarkWhereInputSchema),
            z.lazy(() => BookmarkWhereInputSchema).array(),
          ])
          .optional(),
        OR: z
          .lazy(() => BookmarkWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([
            z.lazy(() => BookmarkWhereInputSchema),
            z.lazy(() => BookmarkWhereInputSchema).array(),
          ])
          .optional(),
        title: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        url: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        image: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        imageBlur: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        desc: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        categoryId: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
        archived: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
        userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        category: z
          .union([
            z.lazy(() => CategoryNullableScalarRelationFilterSchema),
            z.lazy(() => CategoryWhereInputSchema),
          ])
          .optional()
          .nullable(),
        tags: z.lazy(() => TagsOnBookmarksListRelationFilterSchema).optional(),
        user: z
          .union([
            z.lazy(() => UserNullableScalarRelationFilterSchema),
            z.lazy(() => UserWhereInputSchema),
          ])
          .optional()
          .nullable(),
      })
      .strict()
  ) as z.ZodType<Prisma.BookmarkWhereUniqueInput>

export const BookmarkOrderByWithAggregationInputSchema: z.ZodType<Prisma.BookmarkOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      title: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      url: z.lazy(() => SortOrderSchema).optional(),
      image: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      imageBlur: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      desc: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
      categoryId: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      metadata: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      archived: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => BookmarkCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => BookmarkMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => BookmarkMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkOrderByWithAggregationInput>

export const BookmarkScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BookmarkScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema),
          z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => BookmarkScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema),
          z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      title: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      url: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      image: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      desc: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      categoryId: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
      archived: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
      userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkScalarWhereWithAggregatesInput>

export const TagsOnBookmarksWhereInputSchema: z.ZodType<Prisma.TagsOnBookmarksWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => TagsOnBookmarksWhereInputSchema),
        z.lazy(() => TagsOnBookmarksWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TagsOnBookmarksWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TagsOnBookmarksWhereInputSchema),
        z.lazy(() => TagsOnBookmarksWhereInputSchema).array(),
      ])
      .optional(),
    bookmarkId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    tagId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    bookmark: z
      .union([
        z.lazy(() => BookmarkScalarRelationFilterSchema),
        z.lazy(() => BookmarkWhereInputSchema),
      ])
      .optional(),
    tag: z
      .union([z.lazy(() => TagScalarRelationFilterSchema), z.lazy(() => TagWhereInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksWhereInput>

export const TagsOnBookmarksOrderByWithRelationInputSchema: z.ZodType<Prisma.TagsOnBookmarksOrderByWithRelationInput> =
  z
    .object({
      bookmarkId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
      bookmark: z.lazy(() => BookmarkOrderByWithRelationInputSchema).optional(),
      tag: z.lazy(() => TagOrderByWithRelationInputSchema).optional(),
      _relevance: z.lazy(() => TagsOnBookmarksOrderByRelevanceInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksOrderByWithRelationInput>

export const TagsOnBookmarksWhereUniqueInputSchema: z.ZodType<Prisma.TagsOnBookmarksWhereUniqueInput> =
  z
    .object({
      bookmarkId_tagId: z.lazy(() => TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInputSchema),
    })
    .and(
      z
        .object({
          bookmarkId_tagId: z
            .lazy(() => TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInputSchema)
            .optional(),
          AND: z
            .union([
              z.lazy(() => TagsOnBookmarksWhereInputSchema),
              z.lazy(() => TagsOnBookmarksWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => TagsOnBookmarksWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => TagsOnBookmarksWhereInputSchema),
              z.lazy(() => TagsOnBookmarksWhereInputSchema).array(),
            ])
            .optional(),
          bookmarkId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
          tagId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
          bookmark: z
            .union([
              z.lazy(() => BookmarkScalarRelationFilterSchema),
              z.lazy(() => BookmarkWhereInputSchema),
            ])
            .optional(),
          tag: z
            .union([z.lazy(() => TagScalarRelationFilterSchema), z.lazy(() => TagWhereInputSchema)])
            .optional(),
        })
        .strict()
    ) as z.ZodType<Prisma.TagsOnBookmarksWhereUniqueInput>

export const TagsOnBookmarksOrderByWithAggregationInputSchema: z.ZodType<Prisma.TagsOnBookmarksOrderByWithAggregationInput> =
  z
    .object({
      bookmarkId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => TagsOnBookmarksCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => TagsOnBookmarksMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => TagsOnBookmarksMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksOrderByWithAggregationInput>

export const TagsOnBookmarksScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TagsOnBookmarksScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema),
          z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema),
          z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      bookmarkId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      tagId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksScalarWhereWithAggregatesInput>

export const TagWhereInputSchema: z.ZodType<Prisma.TagWhereInput> = z
  .object({
    AND: z
      .union([z.lazy(() => TagWhereInputSchema), z.lazy(() => TagWhereInputSchema).array()])
      .optional(),
    OR: z
      .lazy(() => TagWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([z.lazy(() => TagWhereInputSchema), z.lazy(() => TagWhereInputSchema).array()])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    bookmarks: z.lazy(() => TagsOnBookmarksListRelationFilterSchema).optional(),
    user: z
      .union([
        z.lazy(() => UserNullableScalarRelationFilterSchema),
        z.lazy(() => UserWhereInputSchema),
      ])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.TagWhereInput>

export const TagOrderByWithRelationInputSchema: z.ZodType<Prisma.TagOrderByWithRelationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
    bookmarks: z.lazy(() => TagsOnBookmarksOrderByRelationAggregateInputSchema).optional(),
    user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
    _relevance: z.lazy(() => TagOrderByRelevanceInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagOrderByWithRelationInput>

export const TagWhereUniqueInputSchema: z.ZodType<Prisma.TagWhereUniqueInput> = z
  .union([
    z.object({
      id: z.string().cuid(),
      name_userId: z.lazy(() => TagNameUserIdCompoundUniqueInputSchema),
    }),
    z.object({
      id: z.string().cuid(),
    }),
    z.object({
      name_userId: z.lazy(() => TagNameUserIdCompoundUniqueInputSchema),
    }),
  ])
  .and(
    z
      .object({
        id: z.string().cuid().optional(),
        name_userId: z.lazy(() => TagNameUserIdCompoundUniqueInputSchema).optional(),
        AND: z
          .union([z.lazy(() => TagWhereInputSchema), z.lazy(() => TagWhereInputSchema).array()])
          .optional(),
        OR: z
          .lazy(() => TagWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([z.lazy(() => TagWhereInputSchema), z.lazy(() => TagWhereInputSchema).array()])
          .optional(),
        name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        bookmarks: z.lazy(() => TagsOnBookmarksListRelationFilterSchema).optional(),
        user: z
          .union([
            z.lazy(() => UserNullableScalarRelationFilterSchema),
            z.lazy(() => UserWhereInputSchema),
          ])
          .optional()
          .nullable(),
      })
      .strict()
  ) as z.ZodType<Prisma.TagWhereUniqueInput>

export const TagOrderByWithAggregationInputSchema: z.ZodType<Prisma.TagOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => TagCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => TagMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => TagMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagOrderByWithAggregationInput>

export const TagScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TagScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => TagScalarWhereWithAggregatesInputSchema),
          z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => TagScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => TagScalarWhereWithAggregatesInputSchema),
          z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagScalarWhereWithAggregatesInput>

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CategoryWhereInputSchema),
        z.lazy(() => CategoryWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CategoryWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CategoryWhereInputSchema),
        z.lazy(() => CategoryWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    description: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    bookmarks: z.lazy(() => BookmarkListRelationFilterSchema).optional(),
    user: z
      .union([
        z.lazy(() => UserNullableScalarRelationFilterSchema),
        z.lazy(() => UserWhereInputSchema),
      ])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.CategoryWhereInput>

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      description: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      bookmarks: z.lazy(() => BookmarkOrderByRelationAggregateInputSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
      _relevance: z.lazy(() => CategoryOrderByRelevanceInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryOrderByWithRelationInput>

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z
  .union([
    z.object({
      id: z.string().cuid(),
      name_userId: z.lazy(() => CategoryNameUserIdCompoundUniqueInputSchema),
    }),
    z.object({
      id: z.string().cuid(),
    }),
    z.object({
      name_userId: z.lazy(() => CategoryNameUserIdCompoundUniqueInputSchema),
    }),
  ])
  .and(
    z
      .object({
        id: z.string().cuid().optional(),
        name_userId: z.lazy(() => CategoryNameUserIdCompoundUniqueInputSchema).optional(),
        AND: z
          .union([
            z.lazy(() => CategoryWhereInputSchema),
            z.lazy(() => CategoryWhereInputSchema).array(),
          ])
          .optional(),
        OR: z
          .lazy(() => CategoryWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([
            z.lazy(() => CategoryWhereInputSchema),
            z.lazy(() => CategoryWhereInputSchema).array(),
          ])
          .optional(),
        name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        description: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        bookmarks: z.lazy(() => BookmarkListRelationFilterSchema).optional(),
        user: z
          .union([
            z.lazy(() => UserNullableScalarRelationFilterSchema),
            z.lazy(() => UserWhereInputSchema),
          ])
          .optional()
          .nullable(),
      })
      .strict()
  ) as z.ZodType<Prisma.CategoryWhereUniqueInput>

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      description: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryOrderByWithAggregationInput>

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),
          z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => CategoryScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),
          z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      description: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput>

export const FeedWhereInputSchema: z.ZodType<Prisma.FeedWhereInput> = z
  .object({
    AND: z
      .union([z.lazy(() => FeedWhereInputSchema), z.lazy(() => FeedWhereInputSchema).array()])
      .optional(),
    OR: z
      .lazy(() => FeedWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([z.lazy(() => FeedWhereInputSchema), z.lazy(() => FeedWhereInputSchema).array()])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    url: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    description: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    language: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    copyright: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    lastFetched: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    user: z
      .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
      .optional(),
    feedEntries: z.lazy(() => FeedEntryListRelationFilterSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedWhereInput>

export const FeedOrderByWithRelationInputSchema: z.ZodType<Prisma.FeedOrderByWithRelationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    url: z.lazy(() => SortOrderSchema).optional(),
    description: z
      .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
      .optional(),
    language: z
      .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
      .optional(),
    copyright: z
      .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
      .optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    lastFetched: z
      .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
      .optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
    user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryOrderByRelationAggregateInputSchema).optional(),
    _relevance: z.lazy(() => FeedOrderByRelevanceInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedOrderByWithRelationInput>

export const FeedWhereUniqueInputSchema: z.ZodType<Prisma.FeedWhereUniqueInput> = z
  .union([
    z.object({
      id: z.string().cuid(),
      url_userId: z.lazy(() => FeedUrlUserIdCompoundUniqueInputSchema),
    }),
    z.object({
      id: z.string().cuid(),
    }),
    z.object({
      url_userId: z.lazy(() => FeedUrlUserIdCompoundUniqueInputSchema),
    }),
  ])
  .and(
    z
      .object({
        id: z.string().cuid().optional(),
        url_userId: z.lazy(() => FeedUrlUserIdCompoundUniqueInputSchema).optional(),
        AND: z
          .union([z.lazy(() => FeedWhereInputSchema), z.lazy(() => FeedWhereInputSchema).array()])
          .optional(),
        OR: z
          .lazy(() => FeedWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([z.lazy(() => FeedWhereInputSchema), z.lazy(() => FeedWhereInputSchema).array()])
          .optional(),
        name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        url: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        description: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        language: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        copyright: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        lastFetched: z
          .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
          .optional()
          .nullable(),
        createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        user: z
          .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
          .optional(),
        feedEntries: z.lazy(() => FeedEntryListRelationFilterSchema).optional(),
      })
      .strict()
  ) as z.ZodType<Prisma.FeedWhereUniqueInput>

export const FeedOrderByWithAggregationInputSchema: z.ZodType<Prisma.FeedOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      url: z.lazy(() => SortOrderSchema).optional(),
      description: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      language: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      copyright: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      lastFetched: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => FeedCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => FeedMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => FeedMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedOrderByWithAggregationInput>

export const FeedScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FeedScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => FeedScalarWhereWithAggregatesInputSchema),
          z.lazy(() => FeedScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => FeedScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => FeedScalarWhereWithAggregatesInputSchema),
          z.lazy(() => FeedScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      url: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      description: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      language: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      copyright: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      lastFetched: z
        .union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedScalarWhereWithAggregatesInput>

export const FeedEntryWhereInputSchema: z.ZodType<Prisma.FeedEntryWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => FeedEntryWhereInputSchema),
        z.lazy(() => FeedEntryWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => FeedEntryWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => FeedEntryWhereInputSchema),
        z.lazy(() => FeedEntryWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    guid: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    link: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    content: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    contentSnippet: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    author: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    ingested: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    published: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    unread: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
    categories: z.lazy(() => StringNullableListFilterSchema).optional(),
    feedId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    feed: z
      .union([z.lazy(() => FeedScalarRelationFilterSchema), z.lazy(() => FeedWhereInputSchema)])
      .optional(),
    user: z
      .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
      .optional(),
    feedMedia: z.lazy(() => FeedEntryMediaListRelationFilterSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryWhereInput>

export const FeedEntryOrderByWithRelationInputSchema: z.ZodType<Prisma.FeedEntryOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      guid: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      link: z.lazy(() => SortOrderSchema).optional(),
      content: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      contentSnippet: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      author: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      ingested: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      published: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      unread: z.lazy(() => SortOrderSchema).optional(),
      categories: z.lazy(() => SortOrderSchema).optional(),
      feedId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      feed: z.lazy(() => FeedOrderByWithRelationInputSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaOrderByRelationAggregateInputSchema).optional(),
      _relevance: z.lazy(() => FeedEntryOrderByRelevanceInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryOrderByWithRelationInput>

export const FeedEntryWhereUniqueInputSchema: z.ZodType<Prisma.FeedEntryWhereUniqueInput> = z
  .object({
    id: z.string().cuid(),
  })
  .and(
    z
      .object({
        id: z.string().cuid().optional(),
        AND: z
          .union([
            z.lazy(() => FeedEntryWhereInputSchema),
            z.lazy(() => FeedEntryWhereInputSchema).array(),
          ])
          .optional(),
        OR: z
          .lazy(() => FeedEntryWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([
            z.lazy(() => FeedEntryWhereInputSchema),
            z.lazy(() => FeedEntryWhereInputSchema).array(),
          ])
          .optional(),
        guid: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        link: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        content: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        contentSnippet: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        author: z
          .union([z.lazy(() => StringNullableFilterSchema), z.string()])
          .optional()
          .nullable(),
        ingested: z
          .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
          .optional()
          .nullable(),
        published: z
          .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
          .optional()
          .nullable(),
        unread: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
        categories: z.lazy(() => StringNullableListFilterSchema).optional(),
        feedId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
        createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
        feed: z
          .union([z.lazy(() => FeedScalarRelationFilterSchema), z.lazy(() => FeedWhereInputSchema)])
          .optional(),
        user: z
          .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
          .optional(),
        feedMedia: z.lazy(() => FeedEntryMediaListRelationFilterSchema).optional(),
      })
      .strict()
  ) as z.ZodType<Prisma.FeedEntryWhereUniqueInput>

export const FeedEntryOrderByWithAggregationInputSchema: z.ZodType<Prisma.FeedEntryOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      guid: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      link: z.lazy(() => SortOrderSchema).optional(),
      content: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      contentSnippet: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      author: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      ingested: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      published: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      unread: z.lazy(() => SortOrderSchema).optional(),
      categories: z.lazy(() => SortOrderSchema).optional(),
      feedId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => FeedEntryCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => FeedEntryMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => FeedEntryMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryOrderByWithAggregationInput>

export const FeedEntryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FeedEntryScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema),
          z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema),
          z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      guid: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      title: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      link: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      content: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      author: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      ingested: z
        .union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      published: z
        .union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
        .optional()
        .nullable(),
      unread: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
      categories: z.lazy(() => StringNullableListFilterSchema).optional(),
      feedId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryScalarWhereWithAggregatesInput>

export const FeedEntryMediaWhereInputSchema: z.ZodType<Prisma.FeedEntryMediaWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => FeedEntryMediaWhereInputSchema),
        z.lazy(() => FeedEntryMediaWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => FeedEntryMediaWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => FeedEntryMediaWhereInputSchema),
        z.lazy(() => FeedEntryMediaWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    href: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    title: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    feedEntryId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    feedEntry: z
      .union([
        z.lazy(() => FeedEntryScalarRelationFilterSchema),
        z.lazy(() => FeedEntryWhereInputSchema),
      ])
      .optional(),
    user: z
      .union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaWhereInput>

export const FeedEntryMediaOrderByWithRelationInputSchema: z.ZodType<Prisma.FeedEntryMediaOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      href: z.lazy(() => SortOrderSchema).optional(),
      title: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      feedEntryId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      feedEntry: z.lazy(() => FeedEntryOrderByWithRelationInputSchema).optional(),
      user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
      _relevance: z.lazy(() => FeedEntryMediaOrderByRelevanceInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaOrderByWithRelationInput>

export const FeedEntryMediaWhereUniqueInputSchema: z.ZodType<Prisma.FeedEntryMediaWhereUniqueInput> =
  z
    .object({
      id: z.string().cuid(),
    })
    .and(
      z
        .object({
          id: z.string().cuid().optional(),
          AND: z
            .union([
              z.lazy(() => FeedEntryMediaWhereInputSchema),
              z.lazy(() => FeedEntryMediaWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => FeedEntryMediaWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => FeedEntryMediaWhereInputSchema),
              z.lazy(() => FeedEntryMediaWhereInputSchema).array(),
            ])
            .optional(),
          href: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
          title: z
            .union([z.lazy(() => StringNullableFilterSchema), z.string()])
            .optional()
            .nullable(),
          feedEntryId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
          userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
          createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
          updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
          feedEntry: z
            .union([
              z.lazy(() => FeedEntryScalarRelationFilterSchema),
              z.lazy(() => FeedEntryWhereInputSchema),
            ])
            .optional(),
          user: z
            .union([
              z.lazy(() => UserScalarRelationFilterSchema),
              z.lazy(() => UserWhereInputSchema),
            ])
            .optional(),
        })
        .strict()
    ) as z.ZodType<Prisma.FeedEntryMediaWhereUniqueInput>

export const FeedEntryMediaOrderByWithAggregationInputSchema: z.ZodType<Prisma.FeedEntryMediaOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      href: z.lazy(() => SortOrderSchema).optional(),
      title: z
        .union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
        .optional(),
      feedEntryId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => FeedEntryMediaCountOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => FeedEntryMediaMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => FeedEntryMediaMinOrderByAggregateInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaOrderByWithAggregationInput>

export const FeedEntryMediaScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FeedEntryMediaScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema),
          z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema),
          z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      href: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      title: z
        .union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
        .optional()
        .nullable(),
      feedEntryId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaScalarWhereWithAggregatesInput>

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string().optional().nullable(),
    access_token: z.string().optional().nullable(),
    expires_at: z.number().int().optional().nullable(),
    token_type: z.string().optional().nullable(),
    scope: z.string().optional().nullable(),
    id_token: z.string().optional().nullable(),
    session_state: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema),
  })
  .strict() as z.ZodType<Prisma.AccountCreateInput>

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    userId: z.string(),
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string().optional().nullable(),
    access_token: z.string().optional().nullable(),
    expires_at: z.number().int().optional().nullable(),
    token_type: z.string().optional().nullable(),
    scope: z.string().optional().nullable(),
    id_token: z.string().optional().nullable(),
    session_state: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.AccountUncheckedCreateInput>

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    provider: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    providerAccountId: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    refresh_token: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    access_token: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    expires_at: z
      .union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    token_type: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    scope: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    id_token: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    session_state: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.AccountUpdateInput>

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    provider: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    providerAccountId: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    refresh_token: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    access_token: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    expires_at: z
      .union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    token_type: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    scope: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    id_token: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    session_state: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.AccountUncheckedUpdateInput>

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z
  .object({
    id: z.string().cuid().optional(),
    userId: z.string(),
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string().optional().nullable(),
    access_token: z.string().optional().nullable(),
    expires_at: z.number().int().optional().nullable(),
    token_type: z.string().optional().nullable(),
    scope: z.string().optional().nullable(),
    id_token: z.string().optional().nullable(),
    session_state: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.AccountCreateManyInput>

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      provider: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      providerAccountId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      refresh_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      access_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      expires_at: z
        .union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      token_type: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      scope: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      id_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      session_state: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUpdateManyMutationInput>

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      provider: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      providerAccountId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      refresh_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      access_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      expires_at: z
        .union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      token_type: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      scope: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      id_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      session_state: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUncheckedUpdateManyInput>

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    emailVerified: z.coerce.date().optional().nullable(),
    image: z.string().optional().nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z.coerce.date().optional(),
    accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
    sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
    tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
    feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
    categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserCreateInput>

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    emailVerified: z.coerce.date().optional().nullable(),
    image: z.string().optional().nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z.coerce.date().optional(),
    accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    feedMedia: z
      .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema)
      .optional(),
    categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserUncheckedCreateInput>

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    email: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    emailVerified: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    image: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
    sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
    tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
    feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
    categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserUpdateInput>

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    email: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    emailVerified: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    image: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    feedMedia: z
      .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema)
      .optional(),
    categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserUncheckedUpdateInput>

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    emailVerified: z.coerce.date().optional().nullable(),
    image: z.string().optional().nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.UserCreateManyInput>

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    email: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    emailVerified: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    image: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.UserUpdateManyMutationInput>

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    email: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    emailVerified: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    image: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.UserUncheckedUpdateManyInput>

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    sessionToken: z.string(),
    expires: z.coerce.date(),
    user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema),
  })
  .strict() as z.ZodType<Prisma.SessionCreateInput>

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    sessionToken: z.string(),
    userId: z.string(),
    expires: z.coerce.date(),
  })
  .strict() as z.ZodType<Prisma.SessionUncheckedCreateInput>

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    sessionToken: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    expires: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.SessionUpdateInput>

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    sessionToken: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    expires: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.SessionUncheckedUpdateInput>

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z
  .object({
    id: z.string().cuid().optional(),
    sessionToken: z.string(),
    userId: z.string(),
    expires: z.coerce.date(),
  })
  .strict() as z.ZodType<Prisma.SessionCreateManyInput>

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      sessionToken: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      expires: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUpdateManyMutationInput>

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      sessionToken: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      expires: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUncheckedUpdateManyInput>

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> = z
  .object({
    identifier: z.string(),
    token: z.string(),
    expires: z.coerce.date(),
  })
  .strict() as z.ZodType<Prisma.VerificationTokenCreateInput>

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> =
  z
    .object({
      identifier: z.string(),
      token: z.string(),
      expires: z.coerce.date(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenUncheckedCreateInput>

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> = z
  .object({
    identifier: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    expires: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.VerificationTokenUpdateInput>

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> =
  z
    .object({
      identifier: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      expires: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput>

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> =
  z
    .object({
      identifier: z.string(),
      token: z.string(),
      expires: z.coerce.date(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenCreateManyInput>

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> =
  z
    .object({
      identifier: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      expires: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput>

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> =
  z
    .object({
      identifier: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      expires: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput>

export const BookmarkCreateInputSchema: z.ZodType<Prisma.BookmarkCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    title: z.string().optional().nullable(),
    url: z.string(),
    image: z.string().optional().nullable(),
    imageBlur: z.string().optional().nullable(),
    desc: z.string().optional().nullable(),
    metadata: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    archived: z.boolean().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    category: z.lazy(() => CategoryCreateNestedOneWithoutBookmarksInputSchema).optional(),
    tags: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutBookmarkInputSchema).optional(),
    user: z.lazy(() => UserCreateNestedOneWithoutBookmarksInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkCreateInput>

export const BookmarkUncheckedCreateInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    title: z.string().optional().nullable(),
    url: z.string(),
    image: z.string().optional().nullable(),
    imageBlur: z.string().optional().nullable(),
    desc: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    metadata: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    archived: z.boolean().optional(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    tags: z
      .lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInputSchema)
      .optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkUncheckedCreateInput>

export const BookmarkUpdateInputSchema: z.ZodType<Prisma.BookmarkUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    title: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    image: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    imageBlur: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    desc: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    metadata: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    archived: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    category: z.lazy(() => CategoryUpdateOneWithoutBookmarksNestedInputSchema).optional(),
    tags: z.lazy(() => TagsOnBookmarksUpdateManyWithoutBookmarkNestedInputSchema).optional(),
    user: z.lazy(() => UserUpdateOneWithoutBookmarksNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkUpdateInput>

export const BookmarkUncheckedUpdateInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    title: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    image: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    imageBlur: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    desc: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    categoryId: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    metadata: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    archived: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
    userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    tags: z
      .lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInputSchema)
      .optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateInput>

export const BookmarkCreateManyInputSchema: z.ZodType<Prisma.BookmarkCreateManyInput> = z
  .object({
    id: z.string().cuid().optional(),
    title: z.string().optional().nullable(),
    url: z.string(),
    image: z.string().optional().nullable(),
    imageBlur: z.string().optional().nullable(),
    desc: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    metadata: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    archived: z.boolean().optional(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkCreateManyInput>

export const BookmarkUpdateManyMutationInputSchema: z.ZodType<Prisma.BookmarkUpdateManyMutationInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateManyMutationInput>

export const BookmarkUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      categoryId: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateManyInput>

export const TagsOnBookmarksCreateInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateInput> = z
  .object({
    bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutTagsInputSchema),
    tag: z.lazy(() => TagCreateNestedOneWithoutBookmarksInputSchema),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateInput>

export const TagsOnBookmarksUncheckedCreateInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateInput> =
  z
    .object({
      bookmarkId: z.string(),
      tagId: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateInput>

export const TagsOnBookmarksUpdateInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateInput> = z
  .object({
    bookmark: z.lazy(() => BookmarkUpdateOneRequiredWithoutTagsNestedInputSchema).optional(),
    tag: z.lazy(() => TagUpdateOneRequiredWithoutBookmarksNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateInput>

export const TagsOnBookmarksUncheckedUpdateInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateInput> =
  z
    .object({
      bookmarkId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      tagId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateInput>

export const TagsOnBookmarksCreateManyInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyInput> =
  z
    .object({
      bookmarkId: z.string(),
      tagId: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateManyInput>

export const TagsOnBookmarksUpdateManyMutationInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyMutationInput> =
  z.object({}).strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateManyMutationInput>

export const TagsOnBookmarksUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyInput> =
  z
    .object({
      bookmarkId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      tagId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyInput>

export const TagCreateInputSchema: z.ZodType<Prisma.TagCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    bookmarks: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutTagInputSchema).optional(),
    user: z.lazy(() => UserCreateNestedOneWithoutTagsInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagCreateInput>

export const TagUncheckedCreateInputSchema: z.ZodType<Prisma.TagUncheckedCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    bookmarks: z
      .lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInputSchema)
      .optional(),
  })
  .strict() as z.ZodType<Prisma.TagUncheckedCreateInput>

export const TagUpdateInputSchema: z.ZodType<Prisma.TagUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    bookmarks: z.lazy(() => TagsOnBookmarksUpdateManyWithoutTagNestedInputSchema).optional(),
    user: z.lazy(() => UserUpdateOneWithoutTagsNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagUpdateInput>

export const TagUncheckedUpdateInputSchema: z.ZodType<Prisma.TagUncheckedUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    bookmarks: z
      .lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInputSchema)
      .optional(),
  })
  .strict() as z.ZodType<Prisma.TagUncheckedUpdateInput>

export const TagCreateManyInputSchema: z.ZodType<Prisma.TagCreateManyInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.TagCreateManyInput>

export const TagUpdateManyMutationInputSchema: z.ZodType<Prisma.TagUpdateManyMutationInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.TagUpdateManyMutationInput>

export const TagUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.TagUncheckedUpdateManyInput>

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    description: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutCategoryInputSchema).optional(),
    user: z.lazy(() => UserCreateNestedOneWithoutCategoriesInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryCreateInput>

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    description: z.string().optional().nullable(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutCategoryInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryUncheckedCreateInput>

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    description: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    bookmarks: z.lazy(() => BookmarkUpdateManyWithoutCategoryNestedInputSchema).optional(),
    user: z.lazy(() => UserUpdateOneWithoutCategoriesNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryUpdateInput>

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    description: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryUncheckedUpdateInput>

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    description: z.string().optional().nullable(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryCreateManyInput>

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateManyMutationInput>

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUncheckedUpdateManyInput>

export const FeedCreateInputSchema: z.ZodType<Prisma.FeedCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    url: z.string(),
    description: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    copyright: z.string().optional().nullable(),
    lastFetched: z.coerce.date().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    user: z.lazy(() => UserCreateNestedOneWithoutFeedsInputSchema),
    feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutFeedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedCreateInput>

export const FeedUncheckedCreateInputSchema: z.ZodType<Prisma.FeedUncheckedCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    url: z.string(),
    description: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    copyright: z.string().optional().nullable(),
    userId: z.string(),
    lastFetched: z.coerce.date().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutFeedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedUncheckedCreateInput>

export const FeedUpdateInputSchema: z.ZodType<Prisma.FeedUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    description: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    language: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    copyright: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    lastFetched: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    user: z.lazy(() => UserUpdateOneRequiredWithoutFeedsNestedInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutFeedNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedUpdateInput>

export const FeedUncheckedUpdateInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    description: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    language: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    copyright: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    lastFetched: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutFeedNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedUncheckedUpdateInput>

export const FeedCreateManyInputSchema: z.ZodType<Prisma.FeedCreateManyInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    url: z.string(),
    description: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    copyright: z.string().optional().nullable(),
    userId: z.string(),
    lastFetched: z.coerce.date().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedCreateManyInput>

export const FeedUpdateManyMutationInputSchema: z.ZodType<Prisma.FeedUpdateManyMutationInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    description: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    language: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    copyright: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    lastFetched: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.FeedUpdateManyMutationInput>

export const FeedUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateManyInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    description: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    language: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    copyright: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    lastFetched: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.FeedUncheckedUpdateManyInput>

export const FeedEntryCreateInputSchema: z.ZodType<Prisma.FeedEntryCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    guid: z.string().optional().nullable(),
    title: z.string(),
    link: z.string(),
    content: z.string().optional().nullable(),
    contentSnippet: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
    ingested: z.coerce.date().optional().nullable(),
    published: z.coerce.date().optional().nullable(),
    unread: z.boolean().optional(),
    categories: z
      .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
      .optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    feed: z.lazy(() => FeedCreateNestedOneWithoutFeedEntriesInputSchema),
    user: z.lazy(() => UserCreateNestedOneWithoutFeedEntriesInputSchema),
    feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutFeedEntryInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryCreateInput>

export const FeedEntryUncheckedCreateInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      guid: z.string().optional().nullable(),
      title: z.string(),
      link: z.string(),
      content: z.string().optional().nullable(),
      contentSnippet: z.string().optional().nullable(),
      author: z.string().optional().nullable(),
      ingested: z.coerce.date().optional().nullable(),
      published: z.coerce.date().optional().nullable(),
      unread: z.boolean().optional(),
      categories: z
        .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
        .optional(),
      feedId: z.string(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedCreateInput>

export const FeedEntryUpdateInputSchema: z.ZodType<Prisma.FeedEntryUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    guid: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    content: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    contentSnippet: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    author: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    ingested: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    published: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
    categories: z
      .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
      .optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    feed: z.lazy(() => FeedUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
    user: z.lazy(() => UserUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutFeedEntryNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryUpdateInput>

export const FeedEntryUncheckedUpdateInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      feedId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateInput>

export const FeedEntryCreateManyInputSchema: z.ZodType<Prisma.FeedEntryCreateManyInput> = z
  .object({
    id: z.string().cuid().optional(),
    guid: z.string().optional().nullable(),
    title: z.string(),
    link: z.string(),
    content: z.string().optional().nullable(),
    contentSnippet: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
    ingested: z.coerce.date().optional().nullable(),
    published: z.coerce.date().optional().nullable(),
    unread: z.boolean().optional(),
    categories: z
      .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
      .optional(),
    feedId: z.string(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryCreateManyInput>

export const FeedEntryUpdateManyMutationInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyMutationInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateManyMutationInput>

export const FeedEntryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      feedId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateManyInput>

export const FeedEntryMediaCreateInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateInput> = z
  .object({
    id: z.string().cuid().optional(),
    href: z.string(),
    title: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    feedEntry: z.lazy(() => FeedEntryCreateNestedOneWithoutFeedMediaInputSchema),
    user: z.lazy(() => UserCreateNestedOneWithoutFeedMediaInputSchema),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaCreateInput>

export const FeedEntryMediaUncheckedCreateInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      href: z.string(),
      title: z.string().optional().nullable(),
      feedEntryId: z.string(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedCreateInput>

export const FeedEntryMediaUpdateInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    title: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    feedEntry: z.lazy(() => FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInputSchema).optional(),
    user: z.lazy(() => UserUpdateOneRequiredWithoutFeedMediaNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateInput>

export const FeedEntryMediaUncheckedUpdateInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      feedEntryId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateInput>

export const FeedEntryMediaCreateManyInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      href: z.string(),
      title: z.string().optional().nullable(),
      feedEntryId: z.string(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateManyInput>

export const FeedEntryMediaUpdateManyMutationInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyMutationInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateManyMutationInput>

export const FeedEntryMediaUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      feedEntryId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyInput>

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    search: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
  })
  .strict() as z.ZodType<Prisma.StringFilter>

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z
  .object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    search: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.StringNullableFilter>

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z
  .object({
    equals: z.number().optional().nullable(),
    in: z.number().array().optional().nullable(),
    notIn: z.number().array().optional().nullable(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.IntNullableFilter>

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z
  .object({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
  })
  .strict() as z.ZodType<Prisma.DateTimeFilter>

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z
  .object({
    is: z.lazy(() => UserWhereInputSchema).optional(),
    isNot: z.lazy(() => UserWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserScalarRelationFilter>

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z
  .object({
    sort: z.lazy(() => SortOrderSchema),
    nulls: z.lazy(() => NullsOrderSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.SortOrderInput>

export const AccountOrderByRelevanceInputSchema: z.ZodType<Prisma.AccountOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => AccountOrderByRelevanceFieldEnumSchema),
      z.lazy(() => AccountOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict() as z.ZodType<Prisma.AccountOrderByRelevanceInput>

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> =
  z
    .object({
      provider: z.string(),
      providerAccountId: z.string(),
    })
    .strict() as z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput>

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z.lazy(() => SortOrderSchema).optional(),
      access_token: z.lazy(() => SortOrderSchema).optional(),
      expires_at: z.lazy(() => SortOrderSchema).optional(),
      token_type: z.lazy(() => SortOrderSchema).optional(),
      scope: z.lazy(() => SortOrderSchema).optional(),
      id_token: z.lazy(() => SortOrderSchema).optional(),
      session_state: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.AccountCountOrderByAggregateInput>

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> =
  z
    .object({
      expires_at: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.AccountAvgOrderByAggregateInput>

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z.lazy(() => SortOrderSchema).optional(),
      access_token: z.lazy(() => SortOrderSchema).optional(),
      expires_at: z.lazy(() => SortOrderSchema).optional(),
      token_type: z.lazy(() => SortOrderSchema).optional(),
      scope: z.lazy(() => SortOrderSchema).optional(),
      id_token: z.lazy(() => SortOrderSchema).optional(),
      session_state: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.AccountMaxOrderByAggregateInput>

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      type: z.lazy(() => SortOrderSchema).optional(),
      provider: z.lazy(() => SortOrderSchema).optional(),
      providerAccountId: z.lazy(() => SortOrderSchema).optional(),
      refresh_token: z.lazy(() => SortOrderSchema).optional(),
      access_token: z.lazy(() => SortOrderSchema).optional(),
      expires_at: z.lazy(() => SortOrderSchema).optional(),
      token_type: z.lazy(() => SortOrderSchema).optional(),
      scope: z.lazy(() => SortOrderSchema).optional(),
      id_token: z.lazy(() => SortOrderSchema).optional(),
      session_state: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.AccountMinOrderByAggregateInput>

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> =
  z
    .object({
      expires_at: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.AccountSumOrderByAggregateInput>

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    search: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedStringFilterSchema).optional(),
    _max: z.lazy(() => NestedStringFilterSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.StringWithAggregatesFilter>

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      search: z.string().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      not: z
        .union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.StringNullableWithAggregatesFilter>

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntNullableWithAggregatesFilterSchema)])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.IntNullableWithAggregatesFilter>

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z
  .object({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.DateTimeWithAggregatesFilter>

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z
  .object({
    equals: z.coerce.date().optional().nullable(),
    in: z.coerce.date().array().optional().nullable(),
    notIn: z.coerce.date().array().optional().nullable(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.DateTimeNullableFilter>

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z
  .object({
    equals: InputJsonValueSchema.optional(),
    path: z.string().array().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    string_contains: z.string().optional(),
    string_starts_with: z.string().optional(),
    string_ends_with: z.string().optional(),
    array_starts_with: InputJsonValueSchema.optional().nullable(),
    array_ends_with: InputJsonValueSchema.optional().nullable(),
    array_contains: InputJsonValueSchema.optional().nullable(),
    lt: InputJsonValueSchema.optional(),
    lte: InputJsonValueSchema.optional(),
    gt: InputJsonValueSchema.optional(),
    gte: InputJsonValueSchema.optional(),
    not: InputJsonValueSchema.optional(),
  })
  .strict() as z.ZodType<Prisma.JsonNullableFilter>

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z
  .object({
    every: z.lazy(() => AccountWhereInputSchema).optional(),
    some: z.lazy(() => AccountWhereInputSchema).optional(),
    none: z.lazy(() => AccountWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.AccountListRelationFilter>

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z
  .object({
    every: z.lazy(() => SessionWhereInputSchema).optional(),
    some: z.lazy(() => SessionWhereInputSchema).optional(),
    none: z.lazy(() => SessionWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.SessionListRelationFilter>

export const BookmarkListRelationFilterSchema: z.ZodType<Prisma.BookmarkListRelationFilter> = z
  .object({
    every: z.lazy(() => BookmarkWhereInputSchema).optional(),
    some: z.lazy(() => BookmarkWhereInputSchema).optional(),
    none: z.lazy(() => BookmarkWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkListRelationFilter>

export const TagListRelationFilterSchema: z.ZodType<Prisma.TagListRelationFilter> = z
  .object({
    every: z.lazy(() => TagWhereInputSchema).optional(),
    some: z.lazy(() => TagWhereInputSchema).optional(),
    none: z.lazy(() => TagWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagListRelationFilter>

export const FeedListRelationFilterSchema: z.ZodType<Prisma.FeedListRelationFilter> = z
  .object({
    every: z.lazy(() => FeedWhereInputSchema).optional(),
    some: z.lazy(() => FeedWhereInputSchema).optional(),
    none: z.lazy(() => FeedWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedListRelationFilter>

export const FeedEntryListRelationFilterSchema: z.ZodType<Prisma.FeedEntryListRelationFilter> = z
  .object({
    every: z.lazy(() => FeedEntryWhereInputSchema).optional(),
    some: z.lazy(() => FeedEntryWhereInputSchema).optional(),
    none: z.lazy(() => FeedEntryWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryListRelationFilter>

export const FeedEntryMediaListRelationFilterSchema: z.ZodType<Prisma.FeedEntryMediaListRelationFilter> =
  z
    .object({
      every: z.lazy(() => FeedEntryMediaWhereInputSchema).optional(),
      some: z.lazy(() => FeedEntryMediaWhereInputSchema).optional(),
      none: z.lazy(() => FeedEntryMediaWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaListRelationFilter>

export const CategoryListRelationFilterSchema: z.ZodType<Prisma.CategoryListRelationFilter> = z
  .object({
    every: z.lazy(() => CategoryWhereInputSchema).optional(),
    some: z.lazy(() => CategoryWhereInputSchema).optional(),
    none: z.lazy(() => CategoryWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryListRelationFilter>

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.AccountOrderByRelationAggregateInput>

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.SessionOrderByRelationAggregateInput>

export const BookmarkOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BookmarkOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkOrderByRelationAggregateInput>

export const TagOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TagOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagOrderByRelationAggregateInput>

export const FeedOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FeedOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedOrderByRelationAggregateInput>

export const FeedEntryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FeedEntryOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryOrderByRelationAggregateInput>

export const FeedEntryMediaOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaOrderByRelationAggregateInput>

export const CategoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CategoryOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryOrderByRelationAggregateInput>

export const UserOrderByRelevanceInputSchema: z.ZodType<Prisma.UserOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => UserOrderByRelevanceFieldEnumSchema),
      z.lazy(() => UserOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict() as z.ZodType<Prisma.UserOrderByRelevanceInput>

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      emailVerified: z.lazy(() => SortOrderSchema).optional(),
      image: z.lazy(() => SortOrderSchema).optional(),
      settings: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCountOrderByAggregateInput>

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    email: z.lazy(() => SortOrderSchema).optional(),
    emailVerified: z.lazy(() => SortOrderSchema).optional(),
    image: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserMaxOrderByAggregateInput>

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    email: z.lazy(() => SortOrderSchema).optional(),
    emailVerified: z.lazy(() => SortOrderSchema).optional(),
    image: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserMinOrderByAggregateInput>

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional().nullable(),
      in: z.coerce.date().array().optional().nullable(),
      notIn: z.coerce.date().array().optional().nullable(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter>

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> =
  z
    .object({
      equals: InputJsonValueSchema.optional(),
      path: z.string().array().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      string_contains: z.string().optional(),
      string_starts_with: z.string().optional(),
      string_ends_with: z.string().optional(),
      array_starts_with: InputJsonValueSchema.optional().nullable(),
      array_ends_with: InputJsonValueSchema.optional().nullable(),
      array_contains: InputJsonValueSchema.optional().nullable(),
      lt: InputJsonValueSchema.optional(),
      lte: InputJsonValueSchema.optional(),
      gt: InputJsonValueSchema.optional(),
      gte: InputJsonValueSchema.optional(),
      not: InputJsonValueSchema.optional(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.JsonNullableWithAggregatesFilter>

export const SessionOrderByRelevanceInputSchema: z.ZodType<Prisma.SessionOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => SessionOrderByRelevanceFieldEnumSchema),
      z.lazy(() => SessionOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict() as z.ZodType<Prisma.SessionOrderByRelevanceInput>

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.SessionCountOrderByAggregateInput>

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.SessionMaxOrderByAggregateInput>

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      sessionToken: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.SessionMinOrderByAggregateInput>

export const VerificationTokenOrderByRelevanceInputSchema: z.ZodType<Prisma.VerificationTokenOrderByRelevanceInput> =
  z
    .object({
      fields: z.union([
        z.lazy(() => VerificationTokenOrderByRelevanceFieldEnumSchema),
        z.lazy(() => VerificationTokenOrderByRelevanceFieldEnumSchema).array(),
      ]),
      sort: z.lazy(() => SortOrderSchema),
      search: z.string(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenOrderByRelevanceInput>

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> =
  z
    .object({
      identifier: z.string(),
      token: z.string(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput>

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput>

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput>

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> =
  z
    .object({
      identifier: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      expires: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput>

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z
  .object({
    equals: z.boolean().optional(),
    not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
  })
  .strict() as z.ZodType<Prisma.BoolFilter>

export const CategoryNullableScalarRelationFilterSchema: z.ZodType<Prisma.CategoryNullableScalarRelationFilter> =
  z
    .object({
      is: z
        .lazy(() => CategoryWhereInputSchema)
        .optional()
        .nullable(),
      isNot: z
        .lazy(() => CategoryWhereInputSchema)
        .optional()
        .nullable(),
    })
    .strict() as z.ZodType<Prisma.CategoryNullableScalarRelationFilter>

export const TagsOnBookmarksListRelationFilterSchema: z.ZodType<Prisma.TagsOnBookmarksListRelationFilter> =
  z
    .object({
      every: z.lazy(() => TagsOnBookmarksWhereInputSchema).optional(),
      some: z.lazy(() => TagsOnBookmarksWhereInputSchema).optional(),
      none: z.lazy(() => TagsOnBookmarksWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksListRelationFilter>

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> =
  z
    .object({
      is: z
        .lazy(() => UserWhereInputSchema)
        .optional()
        .nullable(),
      isNot: z
        .lazy(() => UserWhereInputSchema)
        .optional()
        .nullable(),
    })
    .strict() as z.ZodType<Prisma.UserNullableScalarRelationFilter>

export const TagsOnBookmarksOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TagsOnBookmarksOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksOrderByRelationAggregateInput>

export const BookmarkOrderByRelevanceInputSchema: z.ZodType<Prisma.BookmarkOrderByRelevanceInput> =
  z
    .object({
      fields: z.union([
        z.lazy(() => BookmarkOrderByRelevanceFieldEnumSchema),
        z.lazy(() => BookmarkOrderByRelevanceFieldEnumSchema).array(),
      ]),
      sort: z.lazy(() => SortOrderSchema),
      search: z.string(),
    })
    .strict() as z.ZodType<Prisma.BookmarkOrderByRelevanceInput>

export const BookmarkUrlUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.BookmarkUrlUserIdCompoundUniqueInput> =
  z
    .object({
      url: z.string(),
      userId: z.string(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUrlUserIdCompoundUniqueInput>

export const BookmarkCountOrderByAggregateInputSchema: z.ZodType<Prisma.BookmarkCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      url: z.lazy(() => SortOrderSchema).optional(),
      image: z.lazy(() => SortOrderSchema).optional(),
      imageBlur: z.lazy(() => SortOrderSchema).optional(),
      desc: z.lazy(() => SortOrderSchema).optional(),
      categoryId: z.lazy(() => SortOrderSchema).optional(),
      metadata: z.lazy(() => SortOrderSchema).optional(),
      archived: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCountOrderByAggregateInput>

export const BookmarkMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BookmarkMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      url: z.lazy(() => SortOrderSchema).optional(),
      image: z.lazy(() => SortOrderSchema).optional(),
      imageBlur: z.lazy(() => SortOrderSchema).optional(),
      desc: z.lazy(() => SortOrderSchema).optional(),
      categoryId: z.lazy(() => SortOrderSchema).optional(),
      archived: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkMaxOrderByAggregateInput>

export const BookmarkMinOrderByAggregateInputSchema: z.ZodType<Prisma.BookmarkMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      url: z.lazy(() => SortOrderSchema).optional(),
      image: z.lazy(() => SortOrderSchema).optional(),
      imageBlur: z.lazy(() => SortOrderSchema).optional(),
      desc: z.lazy(() => SortOrderSchema).optional(),
      categoryId: z.lazy(() => SortOrderSchema).optional(),
      archived: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkMinOrderByAggregateInput>

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z
  .object({
    equals: z.boolean().optional(),
    not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedBoolFilterSchema).optional(),
    _max: z.lazy(() => NestedBoolFilterSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.BoolWithAggregatesFilter>

export const BookmarkScalarRelationFilterSchema: z.ZodType<Prisma.BookmarkScalarRelationFilter> = z
  .object({
    is: z.lazy(() => BookmarkWhereInputSchema).optional(),
    isNot: z.lazy(() => BookmarkWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkScalarRelationFilter>

export const TagScalarRelationFilterSchema: z.ZodType<Prisma.TagScalarRelationFilter> = z
  .object({
    is: z.lazy(() => TagWhereInputSchema).optional(),
    isNot: z.lazy(() => TagWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagScalarRelationFilter>

export const TagsOnBookmarksOrderByRelevanceInputSchema: z.ZodType<Prisma.TagsOnBookmarksOrderByRelevanceInput> =
  z
    .object({
      fields: z.union([
        z.lazy(() => TagsOnBookmarksOrderByRelevanceFieldEnumSchema),
        z.lazy(() => TagsOnBookmarksOrderByRelevanceFieldEnumSchema).array(),
      ]),
      sort: z.lazy(() => SortOrderSchema),
      search: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksOrderByRelevanceInput>

export const TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInputSchema: z.ZodType<Prisma.TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInput> =
  z
    .object({
      bookmarkId: z.string(),
      tagId: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInput>

export const TagsOnBookmarksCountOrderByAggregateInputSchema: z.ZodType<Prisma.TagsOnBookmarksCountOrderByAggregateInput> =
  z
    .object({
      bookmarkId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCountOrderByAggregateInput>

export const TagsOnBookmarksMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TagsOnBookmarksMaxOrderByAggregateInput> =
  z
    .object({
      bookmarkId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksMaxOrderByAggregateInput>

export const TagsOnBookmarksMinOrderByAggregateInputSchema: z.ZodType<Prisma.TagsOnBookmarksMinOrderByAggregateInput> =
  z
    .object({
      bookmarkId: z.lazy(() => SortOrderSchema).optional(),
      tagId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksMinOrderByAggregateInput>

export const TagOrderByRelevanceInputSchema: z.ZodType<Prisma.TagOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => TagOrderByRelevanceFieldEnumSchema),
      z.lazy(() => TagOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict() as z.ZodType<Prisma.TagOrderByRelevanceInput>

export const TagNameUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.TagNameUserIdCompoundUniqueInput> =
  z
    .object({
      name: z.string(),
      userId: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagNameUserIdCompoundUniqueInput>

export const TagCountOrderByAggregateInputSchema: z.ZodType<Prisma.TagCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagCountOrderByAggregateInput>

export const TagMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TagMaxOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagMaxOrderByAggregateInput>

export const TagMinOrderByAggregateInputSchema: z.ZodType<Prisma.TagMinOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagMinOrderByAggregateInput>

export const CategoryOrderByRelevanceInputSchema: z.ZodType<Prisma.CategoryOrderByRelevanceInput> =
  z
    .object({
      fields: z.union([
        z.lazy(() => CategoryOrderByRelevanceFieldEnumSchema),
        z.lazy(() => CategoryOrderByRelevanceFieldEnumSchema).array(),
      ]),
      sort: z.lazy(() => SortOrderSchema),
      search: z.string(),
    })
    .strict() as z.ZodType<Prisma.CategoryOrderByRelevanceInput>

export const CategoryNameUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.CategoryNameUserIdCompoundUniqueInput> =
  z
    .object({
      name: z.string(),
      userId: z.string(),
    })
    .strict() as z.ZodType<Prisma.CategoryNameUserIdCompoundUniqueInput>

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      description: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryCountOrderByAggregateInput>

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      description: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryMaxOrderByAggregateInput>

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      description: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryMinOrderByAggregateInput>

export const FeedOrderByRelevanceInputSchema: z.ZodType<Prisma.FeedOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => FeedOrderByRelevanceFieldEnumSchema),
      z.lazy(() => FeedOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict() as z.ZodType<Prisma.FeedOrderByRelevanceInput>

export const FeedUrlUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.FeedUrlUserIdCompoundUniqueInput> =
  z
    .object({
      url: z.string(),
      userId: z.string(),
    })
    .strict() as z.ZodType<Prisma.FeedUrlUserIdCompoundUniqueInput>

export const FeedCountOrderByAggregateInputSchema: z.ZodType<Prisma.FeedCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      url: z.lazy(() => SortOrderSchema).optional(),
      description: z.lazy(() => SortOrderSchema).optional(),
      language: z.lazy(() => SortOrderSchema).optional(),
      copyright: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      lastFetched: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedCountOrderByAggregateInput>

export const FeedMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FeedMaxOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    url: z.lazy(() => SortOrderSchema).optional(),
    description: z.lazy(() => SortOrderSchema).optional(),
    language: z.lazy(() => SortOrderSchema).optional(),
    copyright: z.lazy(() => SortOrderSchema).optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    lastFetched: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedMaxOrderByAggregateInput>

export const FeedMinOrderByAggregateInputSchema: z.ZodType<Prisma.FeedMinOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    url: z.lazy(() => SortOrderSchema).optional(),
    description: z.lazy(() => SortOrderSchema).optional(),
    language: z.lazy(() => SortOrderSchema).optional(),
    copyright: z.lazy(() => SortOrderSchema).optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    lastFetched: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedMinOrderByAggregateInput>

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z
  .object({
    equals: z.string().array().optional().nullable(),
    has: z.string().optional().nullable(),
    hasEvery: z.string().array().optional(),
    hasSome: z.string().array().optional(),
    isEmpty: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.StringNullableListFilter>

export const FeedScalarRelationFilterSchema: z.ZodType<Prisma.FeedScalarRelationFilter> = z
  .object({
    is: z.lazy(() => FeedWhereInputSchema).optional(),
    isNot: z.lazy(() => FeedWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedScalarRelationFilter>

export const FeedEntryOrderByRelevanceInputSchema: z.ZodType<Prisma.FeedEntryOrderByRelevanceInput> =
  z
    .object({
      fields: z.union([
        z.lazy(() => FeedEntryOrderByRelevanceFieldEnumSchema),
        z.lazy(() => FeedEntryOrderByRelevanceFieldEnumSchema).array(),
      ]),
      sort: z.lazy(() => SortOrderSchema),
      search: z.string(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryOrderByRelevanceInput>

export const FeedEntryCountOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      guid: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      link: z.lazy(() => SortOrderSchema).optional(),
      content: z.lazy(() => SortOrderSchema).optional(),
      contentSnippet: z.lazy(() => SortOrderSchema).optional(),
      author: z.lazy(() => SortOrderSchema).optional(),
      ingested: z.lazy(() => SortOrderSchema).optional(),
      published: z.lazy(() => SortOrderSchema).optional(),
      unread: z.lazy(() => SortOrderSchema).optional(),
      categories: z.lazy(() => SortOrderSchema).optional(),
      feedId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCountOrderByAggregateInput>

export const FeedEntryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      guid: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      link: z.lazy(() => SortOrderSchema).optional(),
      content: z.lazy(() => SortOrderSchema).optional(),
      contentSnippet: z.lazy(() => SortOrderSchema).optional(),
      author: z.lazy(() => SortOrderSchema).optional(),
      ingested: z.lazy(() => SortOrderSchema).optional(),
      published: z.lazy(() => SortOrderSchema).optional(),
      unread: z.lazy(() => SortOrderSchema).optional(),
      feedId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMaxOrderByAggregateInput>

export const FeedEntryMinOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      guid: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      link: z.lazy(() => SortOrderSchema).optional(),
      content: z.lazy(() => SortOrderSchema).optional(),
      contentSnippet: z.lazy(() => SortOrderSchema).optional(),
      author: z.lazy(() => SortOrderSchema).optional(),
      ingested: z.lazy(() => SortOrderSchema).optional(),
      published: z.lazy(() => SortOrderSchema).optional(),
      unread: z.lazy(() => SortOrderSchema).optional(),
      feedId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMinOrderByAggregateInput>

export const FeedEntryScalarRelationFilterSchema: z.ZodType<Prisma.FeedEntryScalarRelationFilter> =
  z
    .object({
      is: z.lazy(() => FeedEntryWhereInputSchema).optional(),
      isNot: z.lazy(() => FeedEntryWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryScalarRelationFilter>

export const FeedEntryMediaOrderByRelevanceInputSchema: z.ZodType<Prisma.FeedEntryMediaOrderByRelevanceInput> =
  z
    .object({
      fields: z.union([
        z.lazy(() => FeedEntryMediaOrderByRelevanceFieldEnumSchema),
        z.lazy(() => FeedEntryMediaOrderByRelevanceFieldEnumSchema).array(),
      ]),
      sort: z.lazy(() => SortOrderSchema),
      search: z.string(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaOrderByRelevanceInput>

export const FeedEntryMediaCountOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      href: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      feedEntryId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCountOrderByAggregateInput>

export const FeedEntryMediaMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      href: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      feedEntryId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaMaxOrderByAggregateInput>

export const FeedEntryMediaMinOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      href: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      feedEntryId: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaMinOrderByAggregateInput>

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutAccountsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput>

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
  z
    .object({
      set: z.string().optional(),
    })
    .strict() as z.ZodType<Prisma.StringFieldUpdateOperationsInput>

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> =
  z
    .object({
      set: z.string().optional().nullable(),
    })
    .strict() as z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput>

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> =
  z
    .object({
      set: z.number().optional().nullable(),
      increment: z.number().optional(),
      decrement: z.number().optional(),
      multiply: z.number().optional(),
      divide: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput>

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
  z
    .object({
      set: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput>

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutAccountsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
      upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),
          z.lazy(() => UserUpdateWithoutAccountsInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput>

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AccountCreateWithoutUserInputSchema),
          z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput>

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputSchema),
          z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput>

export const BookmarkCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BookmarkCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutUserInputSchema),
          z.lazy(() => BookmarkCreateWithoutUserInputSchema).array(),
          z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateNestedManyWithoutUserInput>

export const TagCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TagCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagCreateWithoutUserInputSchema),
          z.lazy(() => TagCreateWithoutUserInputSchema).array(),
          z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => TagUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => TagCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagCreateNestedManyWithoutUserInput>

export const FeedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedCreateWithoutUserInputSchema),
          z.lazy(() => FeedCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedCreateNestedManyWithoutUserInput>

export const FeedEntryCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateNestedManyWithoutUserInput>

export const FeedEntryMediaCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryMediaCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateNestedManyWithoutUserInput>

export const CategoryCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CategoryCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CategoryCreateWithoutUserInputSchema),
          z.lazy(() => CategoryCreateWithoutUserInputSchema).array(),
          z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => CategoryCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryCreateNestedManyWithoutUserInput>

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AccountCreateWithoutUserInputSchema),
          z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput>

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputSchema),
          z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput>

export const BookmarkUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutUserInputSchema),
          z.lazy(() => BookmarkCreateWithoutUserInputSchema).array(),
          z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedCreateNestedManyWithoutUserInput>

export const TagUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TagUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagCreateWithoutUserInputSchema),
          z.lazy(() => TagCreateWithoutUserInputSchema).array(),
          z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => TagUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => TagCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagUncheckedCreateNestedManyWithoutUserInput>

export const FeedUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedCreateWithoutUserInputSchema),
          z.lazy(() => FeedCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUncheckedCreateNestedManyWithoutUserInput>

export const FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedCreateNestedManyWithoutUserInput>

export const FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryMediaCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedCreateNestedManyWithoutUserInput>

export const CategoryUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CategoryCreateWithoutUserInputSchema),
          z.lazy(() => CategoryCreateWithoutUserInputSchema).array(),
          z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => CategoryCreateManyUserInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput>

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> =
  z
    .object({
      set: z.coerce.date().optional().nullable(),
    })
    .strict() as z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput>

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AccountCreateWithoutUserInputSchema),
          z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => AccountScalarWhereInputSchema),
          z.lazy(() => AccountScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput>

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputSchema),
          z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SessionScalarWhereInputSchema),
          z.lazy(() => SessionScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput>

export const BookmarkUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BookmarkUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutUserInputSchema),
          z.lazy(() => BookmarkCreateWithoutUserInputSchema).array(),
          z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => BookmarkScalarWhereInputSchema),
          z.lazy(() => BookmarkScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateManyWithoutUserNestedInput>

export const TagUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TagUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagCreateWithoutUserInputSchema),
          z.lazy(() => TagCreateWithoutUserInputSchema).array(),
          z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => TagUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => TagCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => TagUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => TagUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TagScalarWhereInputSchema),
          z.lazy(() => TagScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagUpdateManyWithoutUserNestedInput>

export const FeedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedCreateWithoutUserInputSchema),
          z.lazy(() => FeedCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => FeedUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedScalarWhereInputSchema),
          z.lazy(() => FeedScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUpdateManyWithoutUserNestedInput>

export const FeedEntryUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedEntryUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => FeedEntryUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedEntryScalarWhereInputSchema),
          z.lazy(() => FeedEntryScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateManyWithoutUserNestedInput>

export const FeedEntryMediaUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryMediaCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateManyWithoutUserNestedInput>

export const CategoryUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CategoryCreateWithoutUserInputSchema),
          z.lazy(() => CategoryCreateWithoutUserInputSchema).array(),
          z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => CategoryUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => CategoryUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => CategoryCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => CategoryUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => CategoryUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => CategoryUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => CategoryUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CategoryScalarWhereInputSchema),
          z.lazy(() => CategoryScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateManyWithoutUserNestedInput>

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => AccountCreateWithoutUserInputSchema),
          z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => AccountWhereUniqueInputSchema),
          z.lazy(() => AccountWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => AccountScalarWhereInputSchema),
          z.lazy(() => AccountScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput>

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputSchema),
          z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputSchema),
          z.lazy(() => SessionWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => SessionScalarWhereInputSchema),
          z.lazy(() => SessionScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput>

export const BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutUserInputSchema),
          z.lazy(() => BookmarkCreateWithoutUserInputSchema).array(),
          z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => BookmarkScalarWhereInputSchema),
          z.lazy(() => BookmarkScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutUserNestedInput>

export const TagUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagCreateWithoutUserInputSchema),
          z.lazy(() => TagCreateWithoutUserInputSchema).array(),
          z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => TagUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => TagCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TagWhereUniqueInputSchema),
          z.lazy(() => TagWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => TagUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => TagUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TagScalarWhereInputSchema),
          z.lazy(() => TagScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUserNestedInput>

export const FeedUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedCreateWithoutUserInputSchema),
          z.lazy(() => FeedCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedWhereUniqueInputSchema),
          z.lazy(() => FeedWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => FeedUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedScalarWhereInputSchema),
          z.lazy(() => FeedScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUncheckedUpdateManyWithoutUserNestedInput>

export const FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedEntryUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => FeedEntryUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedEntryScalarWhereInputSchema),
          z.lazy(() => FeedEntryScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutUserNestedInput>

export const FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema).array(),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryMediaCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInput>

export const CategoryUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CategoryCreateWithoutUserInputSchema),
          z.lazy(() => CategoryCreateWithoutUserInputSchema).array(),
          z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),
          z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema),
          z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => CategoryUpsertWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => CategoryUpsertWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => CategoryCreateManyUserInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CategoryWhereUniqueInputSchema),
          z.lazy(() => CategoryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => CategoryUpdateWithWhereUniqueWithoutUserInputSchema),
          z.lazy(() => CategoryUpdateWithWhereUniqueWithoutUserInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => CategoryUpdateManyWithWhereWithoutUserInputSchema),
          z.lazy(() => CategoryUpdateManyWithWhereWithoutUserInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CategoryScalarWhereInputSchema),
          z.lazy(() => CategoryScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput>

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutSessionsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput>

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutSessionsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
      upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),
          z.lazy(() => UserUpdateWithoutSessionsInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput>

export const CategoryCreateNestedOneWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutBookmarksInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CategoryCreateWithoutBookmarksInputSchema),
          z.lazy(() => CategoryUncheckedCreateWithoutBookmarksInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutBookmarksInputSchema).optional(),
      connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryCreateNestedOneWithoutBookmarksInput>

export const TagsOnBookmarksCreateNestedManyWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateNestedManyWithoutBookmarkInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema).array(),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateNestedManyWithoutBookmarkInput>

export const UserCreateNestedOneWithoutBookmarksInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutBookmarksInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutBookmarksInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutBookmarksInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBookmarksInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutBookmarksInput>

export const TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema).array(),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInput>

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> =
  z
    .object({
      set: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.BoolFieldUpdateOperationsInput>

export const CategoryUpdateOneWithoutBookmarksNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneWithoutBookmarksNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CategoryCreateWithoutBookmarksInputSchema),
          z.lazy(() => CategoryUncheckedCreateWithoutBookmarksInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutBookmarksInputSchema).optional(),
      upsert: z.lazy(() => CategoryUpsertWithoutBookmarksInputSchema).optional(),
      disconnect: z.union([z.boolean(), z.lazy(() => CategoryWhereInputSchema)]).optional(),
      delete: z.union([z.boolean(), z.lazy(() => CategoryWhereInputSchema)]).optional(),
      connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => CategoryUpdateToOneWithWhereWithoutBookmarksInputSchema),
          z.lazy(() => CategoryUpdateWithoutBookmarksInputSchema),
          z.lazy(() => CategoryUncheckedUpdateWithoutBookmarksInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateOneWithoutBookmarksNestedInput>

export const TagsOnBookmarksUpdateManyWithoutBookmarkNestedInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithoutBookmarkNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema).array(),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithoutBookmarkNestedInput>

export const UserUpdateOneWithoutBookmarksNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutBookmarksNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutBookmarksInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutBookmarksInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBookmarksInputSchema).optional(),
      upsert: z.lazy(() => UserUpsertWithoutBookmarksInputSchema).optional(),
      disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputSchema)]).optional(),
      delete: z.union([z.boolean(), z.lazy(() => UserWhereInputSchema)]).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutBookmarksInputSchema),
          z.lazy(() => UserUpdateWithoutBookmarksInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateOneWithoutBookmarksNestedInput>

export const TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema).array(),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema),
          z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInput>

export const BookmarkCreateNestedOneWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkCreateNestedOneWithoutTagsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutTagsInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => BookmarkCreateOrConnectWithoutTagsInputSchema).optional(),
      connect: z.lazy(() => BookmarkWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateNestedOneWithoutTagsInput>

export const TagCreateNestedOneWithoutBookmarksInputSchema: z.ZodType<Prisma.TagCreateNestedOneWithoutBookmarksInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagCreateWithoutBookmarksInputSchema),
          z.lazy(() => TagUncheckedCreateWithoutBookmarksInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutBookmarksInputSchema).optional(),
      connect: z.lazy(() => TagWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagCreateNestedOneWithoutBookmarksInput>

export const BookmarkUpdateOneRequiredWithoutTagsNestedInputSchema: z.ZodType<Prisma.BookmarkUpdateOneRequiredWithoutTagsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutTagsInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => BookmarkCreateOrConnectWithoutTagsInputSchema).optional(),
      upsert: z.lazy(() => BookmarkUpsertWithoutTagsInputSchema).optional(),
      connect: z.lazy(() => BookmarkWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => BookmarkUpdateToOneWithWhereWithoutTagsInputSchema),
          z.lazy(() => BookmarkUpdateWithoutTagsInputSchema),
          z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateOneRequiredWithoutTagsNestedInput>

export const TagUpdateOneRequiredWithoutBookmarksNestedInputSchema: z.ZodType<Prisma.TagUpdateOneRequiredWithoutBookmarksNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagCreateWithoutBookmarksInputSchema),
          z.lazy(() => TagUncheckedCreateWithoutBookmarksInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutBookmarksInputSchema).optional(),
      upsert: z.lazy(() => TagUpsertWithoutBookmarksInputSchema).optional(),
      connect: z.lazy(() => TagWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => TagUpdateToOneWithWhereWithoutBookmarksInputSchema),
          z.lazy(() => TagUpdateWithoutBookmarksInputSchema),
          z.lazy(() => TagUncheckedUpdateWithoutBookmarksInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagUpdateOneRequiredWithoutBookmarksNestedInput>

export const TagsOnBookmarksCreateNestedManyWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateNestedManyWithoutTagInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema).array(),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagsOnBookmarksCreateManyTagInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateNestedManyWithoutTagInput>

export const UserCreateNestedOneWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTagsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutTagsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutTagsInput>

export const TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema).array(),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagsOnBookmarksCreateManyTagInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInput>

export const TagsOnBookmarksUpdateManyWithoutTagNestedInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithoutTagNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema).array(),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagsOnBookmarksCreateManyTagInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithoutTagNestedInput>

export const UserUpdateOneWithoutTagsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutTagsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutTagsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema).optional(),
      upsert: z.lazy(() => UserUpsertWithoutTagsInputSchema).optional(),
      disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputSchema)]).optional(),
      delete: z.union([z.boolean(), z.lazy(() => UserWhereInputSchema)]).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutTagsInputSchema),
          z.lazy(() => UserUpdateWithoutTagsInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutTagsInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateOneWithoutTagsNestedInput>

export const TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema).array(),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => TagsOnBookmarksCreateManyTagInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
          z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema),
          z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInput>

export const BookmarkCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkCreateNestedManyWithoutCategoryInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),
          z.lazy(() => BookmarkCreateWithoutCategoryInputSchema).array(),
          z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema),
          z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => BookmarkCreateManyCategoryInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateNestedManyWithoutCategoryInput>

export const UserCreateNestedOneWithoutCategoriesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCategoriesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutCategoriesInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutCategoriesInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCategoriesInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutCategoriesInput>

export const BookmarkUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateNestedManyWithoutCategoryInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),
          z.lazy(() => BookmarkCreateWithoutCategoryInputSchema).array(),
          z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema),
          z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => BookmarkCreateManyCategoryInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedCreateNestedManyWithoutCategoryInput>

export const BookmarkUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.BookmarkUpdateManyWithoutCategoryNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),
          z.lazy(() => BookmarkCreateWithoutCategoryInputSchema).array(),
          z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema),
          z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => BookmarkCreateManyCategoryInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => BookmarkUpdateManyWithWhereWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUpdateManyWithWhereWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => BookmarkScalarWhereInputSchema),
          z.lazy(() => BookmarkScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateManyWithoutCategoryNestedInput>

export const UserUpdateOneWithoutCategoriesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutCategoriesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutCategoriesInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutCategoriesInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCategoriesInputSchema).optional(),
      upsert: z.lazy(() => UserUpsertWithoutCategoriesInputSchema).optional(),
      disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputSchema)]).optional(),
      delete: z.union([z.boolean(), z.lazy(() => UserWhereInputSchema)]).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutCategoriesInputSchema),
          z.lazy(() => UserUpdateWithoutCategoriesInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutCategoriesInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateOneWithoutCategoriesNestedInput>

export const BookmarkUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutCategoryNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),
          z.lazy(() => BookmarkCreateWithoutCategoryInputSchema).array(),
          z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema),
          z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => BookmarkCreateManyCategoryInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => BookmarkWhereUniqueInputSchema),
          z.lazy(() => BookmarkWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => BookmarkUpdateManyWithWhereWithoutCategoryInputSchema),
          z.lazy(() => BookmarkUpdateManyWithWhereWithoutCategoryInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => BookmarkScalarWhereInputSchema),
          z.lazy(() => BookmarkScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutCategoryNestedInput>

export const UserCreateNestedOneWithoutFeedsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFeedsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutFeedsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutFeedsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutFeedsInput>

export const FeedEntryCreateNestedManyWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryCreateNestedManyWithoutFeedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),
          z.lazy(() => FeedEntryCreateWithoutFeedInputSchema).array(),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema),
          z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryCreateManyFeedInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateNestedManyWithoutFeedInput>

export const FeedEntryUncheckedCreateNestedManyWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateNestedManyWithoutFeedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),
          z.lazy(() => FeedEntryCreateWithoutFeedInputSchema).array(),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema),
          z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryCreateManyFeedInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedCreateNestedManyWithoutFeedInput>

export const UserUpdateOneRequiredWithoutFeedsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutFeedsInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutFeedsInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedsInputSchema).optional(),
      upsert: z.lazy(() => UserUpsertWithoutFeedsInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutFeedsInputSchema),
          z.lazy(() => UserUpdateWithoutFeedsInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutFeedsInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedsNestedInput>

export const FeedEntryUpdateManyWithoutFeedNestedInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyWithoutFeedNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),
          z.lazy(() => FeedEntryCreateWithoutFeedInputSchema).array(),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema),
          z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryCreateManyFeedInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedEntryUpdateManyWithWhereWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUpdateManyWithWhereWithoutFeedInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedEntryScalarWhereInputSchema),
          z.lazy(() => FeedEntryScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateManyWithoutFeedNestedInput>

export const FeedEntryUncheckedUpdateManyWithoutFeedNestedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutFeedNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),
          z.lazy(() => FeedEntryCreateWithoutFeedInputSchema).array(),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema),
          z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryCreateManyFeedInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryWhereUniqueInputSchema),
          z.lazy(() => FeedEntryWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedEntryUpdateManyWithWhereWithoutFeedInputSchema),
          z.lazy(() => FeedEntryUpdateManyWithWhereWithoutFeedInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedEntryScalarWhereInputSchema),
          z.lazy(() => FeedEntryScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutFeedNestedInput>

export const FeedEntryCreatecategoriesInputSchema: z.ZodType<Prisma.FeedEntryCreatecategoriesInput> =
  z
    .object({
      set: z.string().array(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreatecategoriesInput>

export const FeedCreateNestedOneWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedCreateNestedOneWithoutFeedEntriesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedCreateWithoutFeedEntriesInputSchema),
          z.lazy(() => FeedUncheckedCreateWithoutFeedEntriesInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutFeedEntriesInputSchema).optional(),
      connect: z.lazy(() => FeedWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedCreateNestedOneWithoutFeedEntriesInput>

export const UserCreateNestedOneWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFeedEntriesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutFeedEntriesInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutFeedEntriesInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedEntriesInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutFeedEntriesInput>

export const FeedEntryMediaCreateNestedManyWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateNestedManyWithoutFeedEntryInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema).array(),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateNestedManyWithoutFeedEntryInput>

export const FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema).array(),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema).optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInput>

export const FeedEntryUpdatecategoriesInputSchema: z.ZodType<Prisma.FeedEntryUpdatecategoriesInput> =
  z
    .object({
      set: z.string().array().optional(),
      push: z.union([z.string(), z.string().array()]).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdatecategoriesInput>

export const FeedUpdateOneRequiredWithoutFeedEntriesNestedInputSchema: z.ZodType<Prisma.FeedUpdateOneRequiredWithoutFeedEntriesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedCreateWithoutFeedEntriesInputSchema),
          z.lazy(() => FeedUncheckedCreateWithoutFeedEntriesInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutFeedEntriesInputSchema).optional(),
      upsert: z.lazy(() => FeedUpsertWithoutFeedEntriesInputSchema).optional(),
      connect: z.lazy(() => FeedWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => FeedUpdateToOneWithWhereWithoutFeedEntriesInputSchema),
          z.lazy(() => FeedUpdateWithoutFeedEntriesInputSchema),
          z.lazy(() => FeedUncheckedUpdateWithoutFeedEntriesInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUpdateOneRequiredWithoutFeedEntriesNestedInput>

export const UserUpdateOneRequiredWithoutFeedEntriesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedEntriesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutFeedEntriesInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutFeedEntriesInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedEntriesInputSchema).optional(),
      upsert: z.lazy(() => UserUpsertWithoutFeedEntriesInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutFeedEntriesInputSchema),
          z.lazy(() => UserUpdateWithoutFeedEntriesInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutFeedEntriesInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedEntriesNestedInput>

export const FeedEntryMediaUpdateManyWithoutFeedEntryNestedInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyWithoutFeedEntryNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema).array(),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateManyWithoutFeedEntryNestedInput>

export const FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema).array(),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      createMany: z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema).optional(),
      set: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
          z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema),
          z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema).array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInput>

export const FeedEntryCreateNestedOneWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryCreateNestedOneWithoutFeedMediaInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutFeedMediaInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedMediaInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => FeedEntryCreateOrConnectWithoutFeedMediaInputSchema).optional(),
      connect: z.lazy(() => FeedEntryWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateNestedOneWithoutFeedMediaInput>

export const UserCreateNestedOneWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFeedMediaInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutFeedMediaInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutFeedMediaInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedMediaInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutFeedMediaInput>

export const FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInputSchema: z.ZodType<Prisma.FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => FeedEntryCreateWithoutFeedMediaInputSchema),
          z.lazy(() => FeedEntryUncheckedCreateWithoutFeedMediaInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => FeedEntryCreateOrConnectWithoutFeedMediaInputSchema).optional(),
      upsert: z.lazy(() => FeedEntryUpsertWithoutFeedMediaInputSchema).optional(),
      connect: z.lazy(() => FeedEntryWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => FeedEntryUpdateToOneWithWhereWithoutFeedMediaInputSchema),
          z.lazy(() => FeedEntryUpdateWithoutFeedMediaInputSchema),
          z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedMediaInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInput>

export const UserUpdateOneRequiredWithoutFeedMediaNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedMediaNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutFeedMediaInputSchema),
          z.lazy(() => UserUncheckedCreateWithoutFeedMediaInputSchema),
        ])
        .optional(),
      connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedMediaInputSchema).optional(),
      upsert: z.lazy(() => UserUpsertWithoutFeedMediaInputSchema).optional(),
      connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => UserUpdateToOneWithWhereWithoutFeedMediaInputSchema),
          z.lazy(() => UserUpdateWithoutFeedMediaInputSchema),
          z.lazy(() => UserUncheckedUpdateWithoutFeedMediaInputSchema),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedMediaNestedInput>

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    search: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
  })
  .strict() as z.ZodType<Prisma.NestedStringFilter>

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z
  .object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    search: z.string().optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.NestedStringNullableFilter>

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z
  .object({
    equals: z.number().optional().nullable(),
    in: z.number().array().optional().nullable(),
    notIn: z.number().array().optional().nullable(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.NestedIntNullableFilter>

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z
  .object({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
  })
  .strict() as z.ZodType<Prisma.NestedDateTimeFilter>

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      search: z.string().optional(),
      not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.NestedStringWithAggregatesFilter>

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
  })
  .strict() as z.ZodType<Prisma.NestedIntFilter>

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      search: z.string().optional(),
      not: z
        .union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter>

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntNullableWithAggregatesFilterSchema)])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter>

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z
  .object({
    equals: z.number().optional().nullable(),
    in: z.number().array().optional().nullable(),
    notIn: z.number().array().optional().nullable(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedFloatNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.NestedFloatNullableFilter>

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional(),
      in: z.coerce.date().array().optional(),
      notIn: z.coerce.date().array().optional(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter>

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z
  .object({
    equals: z.coerce.date().optional().nullable(),
    in: z.coerce.date().array().optional().nullable(),
    notIn: z.coerce.date().array().optional().nullable(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict() as z.ZodType<Prisma.NestedDateTimeNullableFilter>

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional().nullable(),
      in: z.coerce.date().array().optional().nullable(),
      notIn: z.coerce.date().array().optional().nullable(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter>

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z
  .object({
    equals: InputJsonValueSchema.optional(),
    path: z.string().array().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    string_contains: z.string().optional(),
    string_starts_with: z.string().optional(),
    string_ends_with: z.string().optional(),
    array_starts_with: InputJsonValueSchema.optional().nullable(),
    array_ends_with: InputJsonValueSchema.optional().nullable(),
    array_contains: InputJsonValueSchema.optional().nullable(),
    lt: InputJsonValueSchema.optional(),
    lte: InputJsonValueSchema.optional(),
    gt: InputJsonValueSchema.optional(),
    gte: InputJsonValueSchema.optional(),
    not: InputJsonValueSchema.optional(),
  })
  .strict() as z.ZodType<Prisma.NestedJsonNullableFilter>

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z
  .object({
    equals: z.boolean().optional(),
    not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
  })
  .strict() as z.ZodType<Prisma.NestedBoolFilter>

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> =
  z
    .object({
      equals: z.boolean().optional(),
      not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedBoolFilterSchema).optional(),
      _max: z.lazy(() => NestedBoolFilterSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.NestedBoolWithAggregatesFilter>

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
      categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateWithoutAccountsInput>

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput>

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutAccountsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput>

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutAccountsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutAccountsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpsertWithoutAccountsInput>

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutAccountsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput>

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
      categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateWithoutAccountsInput>

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput>

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      type: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
      refresh_token: z.string().optional().nullable(),
      access_token: z.string().optional().nullable(),
      expires_at: z.number().int().optional().nullable(),
      token_type: z.string().optional().nullable(),
      scope: z.string().optional().nullable(),
      id_token: z.string().optional().nullable(),
      session_state: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.AccountCreateWithoutUserInput>

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      type: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
      refresh_token: z.string().optional().nullable(),
      access_token: z.string().optional().nullable(),
      expires_at: z.number().int().optional().nullable(),
      token_type: z.string().optional().nullable(),
      scope: z.string().optional().nullable(),
      id_token: z.string().optional().nullable(),
      session_state: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput>

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AccountWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => AccountCreateWithoutUserInputSchema),
        z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput>

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => AccountCreateManyUserInputSchema),
        z.lazy(() => AccountCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.AccountCreateManyUserInputEnvelope>

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      sessionToken: z.string(),
      expires: z.coerce.date(),
    })
    .strict() as z.ZodType<Prisma.SessionCreateWithoutUserInput>

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      sessionToken: z.string(),
      expires: z.coerce.date(),
    })
    .strict() as z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput>

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => SessionCreateWithoutUserInputSchema),
        z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput>

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => SessionCreateManyUserInputSchema),
        z.lazy(() => SessionCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.SessionCreateManyUserInputEnvelope>

export const BookmarkCreateWithoutUserInputSchema: z.ZodType<Prisma.BookmarkCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      title: z.string().optional().nullable(),
      url: z.string(),
      image: z.string().optional().nullable(),
      imageBlur: z.string().optional().nullable(),
      desc: z.string().optional().nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      category: z.lazy(() => CategoryCreateNestedOneWithoutBookmarksInputSchema).optional(),
      tags: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutBookmarkInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateWithoutUserInput>

export const BookmarkUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      title: z.string().optional().nullable(),
      url: z.string(),
      image: z.string().optional().nullable(),
      imageBlur: z.string().optional().nullable(),
      desc: z.string().optional().nullable(),
      categoryId: z.string().optional().nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      tags: z
        .lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedCreateWithoutUserInput>

export const BookmarkCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => BookmarkWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => BookmarkCreateWithoutUserInputSchema),
        z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateOrConnectWithoutUserInput>

export const BookmarkCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.BookmarkCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => BookmarkCreateManyUserInputSchema),
        z.lazy(() => BookmarkCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateManyUserInputEnvelope>

export const TagCreateWithoutUserInputSchema: z.ZodType<Prisma.TagCreateWithoutUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    bookmarks: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutTagInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagCreateWithoutUserInput>

export const TagUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      bookmarks: z
        .lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagUncheckedCreateWithoutUserInput>

export const TagCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => TagWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => TagCreateWithoutUserInputSchema),
        z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagCreateOrConnectWithoutUserInput>

export const TagCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.TagCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => TagCreateManyUserInputSchema),
        z.lazy(() => TagCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.TagCreateManyUserInputEnvelope>

export const FeedCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedCreateWithoutUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    url: z.string(),
    description: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    copyright: z.string().optional().nullable(),
    lastFetched: z.coerce.date().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutFeedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedCreateWithoutUserInput>

export const FeedUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedUncheckedCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      url: z.string(),
      description: z.string().optional().nullable(),
      language: z.string().optional().nullable(),
      copyright: z.string().optional().nullable(),
      lastFetched: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedCreateNestedManyWithoutFeedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUncheckedCreateWithoutUserInput>

export const FeedCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FeedCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => FeedCreateWithoutUserInputSchema),
        z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedCreateOrConnectWithoutUserInput>

export const FeedCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FeedCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => FeedCreateManyUserInputSchema),
        z.lazy(() => FeedCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedCreateManyUserInputEnvelope>

export const FeedEntryCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      guid: z.string().optional().nullable(),
      title: z.string(),
      link: z.string(),
      content: z.string().optional().nullable(),
      contentSnippet: z.string().optional().nullable(),
      author: z.string().optional().nullable(),
      ingested: z.coerce.date().optional().nullable(),
      published: z.coerce.date().optional().nullable(),
      unread: z.boolean().optional(),
      categories: z
        .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      feed: z.lazy(() => FeedCreateNestedOneWithoutFeedEntriesInputSchema),
      feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutFeedEntryInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateWithoutUserInput>

export const FeedEntryUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      guid: z.string().optional().nullable(),
      title: z.string(),
      link: z.string(),
      content: z.string().optional().nullable(),
      contentSnippet: z.string().optional().nullable(),
      author: z.string().optional().nullable(),
      ingested: z.coerce.date().optional().nullable(),
      published: z.coerce.date().optional().nullable(),
      unread: z.boolean().optional(),
      categories: z
        .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
        .optional(),
      feedId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutUserInput>

export const FeedEntryCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => FeedEntryCreateWithoutUserInputSchema),
        z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutUserInput>

export const FeedEntryCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FeedEntryCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => FeedEntryCreateManyUserInputSchema),
        z.lazy(() => FeedEntryCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateManyUserInputEnvelope>

export const FeedEntryMediaCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      href: z.string(),
      title: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      feedEntry: z.lazy(() => FeedEntryCreateNestedOneWithoutFeedMediaInputSchema),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateWithoutUserInput>

export const FeedEntryMediaUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      href: z.string(),
      title: z.string().optional().nullable(),
      feedEntryId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedCreateWithoutUserInput>

export const FeedEntryMediaCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateOrConnectWithoutUserInput>

export const FeedEntryMediaCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => FeedEntryMediaCreateManyUserInputSchema),
        z.lazy(() => FeedEntryMediaCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateManyUserInputEnvelope>

export const CategoryCreateWithoutUserInputSchema: z.ZodType<Prisma.CategoryCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      description: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutCategoryInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryCreateWithoutUserInput>

export const CategoryUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      description: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      bookmarks: z
        .lazy(() => BookmarkUncheckedCreateNestedManyWithoutCategoryInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUncheckedCreateWithoutUserInput>

export const CategoryCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => CategoryWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => CategoryCreateWithoutUserInputSchema),
        z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.CategoryCreateOrConnectWithoutUserInput>

export const CategoryCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.CategoryCreateManyUserInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => CategoryCreateManyUserInputSchema),
        z.lazy(() => CategoryCreateManyUserInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryCreateManyUserInputEnvelope>

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AccountWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => AccountUpdateWithoutUserInputSchema),
        z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => AccountCreateWithoutUserInputSchema),
        z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput>

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AccountWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => AccountUpdateWithoutUserInputSchema),
        z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput>

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => AccountScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => AccountUpdateManyMutationInputSchema),
        z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput>

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => AccountScalarWhereInputSchema),
        z.lazy(() => AccountScalarWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => AccountScalarWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => AccountScalarWhereInputSchema),
        z.lazy(() => AccountScalarWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    provider: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    providerAccountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    refresh_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    access_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    expires_at: z
      .union([z.lazy(() => IntNullableFilterSchema), z.number()])
      .optional()
      .nullable(),
    token_type: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    scope: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    id_token: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    session_state: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  })
  .strict() as z.ZodType<Prisma.AccountScalarWhereInput>

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => SessionUpdateWithoutUserInputSchema),
        z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => SessionCreateWithoutUserInputSchema),
        z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput>

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => SessionWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => SessionUpdateWithoutUserInputSchema),
        z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput>

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => SessionScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => SessionUpdateManyMutationInputSchema),
        z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput>

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => SessionScalarWhereInputSchema),
        z.lazy(() => SessionScalarWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => SessionScalarWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => SessionScalarWhereInputSchema),
        z.lazy(() => SessionScalarWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    sessionToken: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    expires: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  })
  .strict() as z.ZodType<Prisma.SessionScalarWhereInput>

export const BookmarkUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => BookmarkWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => BookmarkUpdateWithoutUserInputSchema),
        z.lazy(() => BookmarkUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => BookmarkCreateWithoutUserInputSchema),
        z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutUserInput>

export const BookmarkUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => BookmarkWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => BookmarkUpdateWithoutUserInputSchema),
        z.lazy(() => BookmarkUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutUserInput>

export const BookmarkUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => BookmarkScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => BookmarkUpdateManyMutationInputSchema),
        z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateManyWithWhereWithoutUserInput>

export const BookmarkScalarWhereInputSchema: z.ZodType<Prisma.BookmarkScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => BookmarkScalarWhereInputSchema),
        z.lazy(() => BookmarkScalarWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => BookmarkScalarWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => BookmarkScalarWhereInputSchema),
        z.lazy(() => BookmarkScalarWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    title: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    url: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    image: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    imageBlur: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    desc: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    categoryId: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
    archived: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkScalarWhereInput>

export const TagUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TagUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => TagWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => TagUpdateWithoutUserInputSchema),
        z.lazy(() => TagUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => TagCreateWithoutUserInputSchema),
        z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagUpsertWithWhereUniqueWithoutUserInput>

export const TagUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TagUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => TagWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => TagUpdateWithoutUserInputSchema),
        z.lazy(() => TagUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagUpdateWithWhereUniqueWithoutUserInput>

export const TagUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.TagUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => TagScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => TagUpdateManyMutationInputSchema),
        z.lazy(() => TagUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagUpdateManyWithWhereWithoutUserInput>

export const TagScalarWhereInputSchema: z.ZodType<Prisma.TagScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => TagScalarWhereInputSchema),
        z.lazy(() => TagScalarWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TagScalarWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TagScalarWhereInputSchema),
        z.lazy(() => TagScalarWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  })
  .strict() as z.ZodType<Prisma.TagScalarWhereInput>

export const FeedUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => FeedUpdateWithoutUserInputSchema),
        z.lazy(() => FeedUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => FeedCreateWithoutUserInputSchema),
        z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedUpsertWithWhereUniqueWithoutUserInput>

export const FeedUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => FeedUpdateWithoutUserInputSchema),
        z.lazy(() => FeedUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedUpdateWithWhereUniqueWithoutUserInput>

export const FeedUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FeedUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => FeedUpdateManyMutationInputSchema),
        z.lazy(() => FeedUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedUpdateManyWithWhereWithoutUserInput>

export const FeedScalarWhereInputSchema: z.ZodType<Prisma.FeedScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => FeedScalarWhereInputSchema),
        z.lazy(() => FeedScalarWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => FeedScalarWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => FeedScalarWhereInputSchema),
        z.lazy(() => FeedScalarWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    url: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    description: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    language: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    copyright: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    lastFetched: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedScalarWhereInput>

export const FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => FeedEntryUpdateWithoutUserInputSchema),
        z.lazy(() => FeedEntryUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => FeedEntryCreateWithoutUserInputSchema),
        z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpsertWithWhereUniqueWithoutUserInput>

export const FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => FeedEntryUpdateWithoutUserInputSchema),
        z.lazy(() => FeedEntryUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateWithWhereUniqueWithoutUserInput>

export const FeedEntryUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => FeedEntryUpdateManyMutationInputSchema),
        z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateManyWithWhereWithoutUserInput>

export const FeedEntryScalarWhereInputSchema: z.ZodType<Prisma.FeedEntryScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => FeedEntryScalarWhereInputSchema),
        z.lazy(() => FeedEntryScalarWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => FeedEntryScalarWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => FeedEntryScalarWhereInputSchema),
        z.lazy(() => FeedEntryScalarWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    guid: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    link: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    content: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    contentSnippet: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    author: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    ingested: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    published: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    unread: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
    categories: z.lazy(() => StringNullableListFilterSchema).optional(),
    feedId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryScalarWhereInput>

export const FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => FeedEntryMediaUpdateWithoutUserInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpsertWithWhereUniqueWithoutUserInput>

export const FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => FeedEntryMediaUpdateWithoutUserInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateWithWhereUniqueWithoutUserInput>

export const FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => FeedEntryMediaUpdateManyMutationInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateManyWithWhereWithoutUserInput>

export const FeedEntryMediaScalarWhereInputSchema: z.ZodType<Prisma.FeedEntryMediaScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => FeedEntryMediaScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
          z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      href: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      title: z
        .union([z.lazy(() => StringNullableFilterSchema), z.string()])
        .optional()
        .nullable(),
      feedEntryId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
      updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaScalarWhereInput>

export const CategoryUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CategoryUpsertWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => CategoryWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => CategoryUpdateWithoutUserInputSchema),
        z.lazy(() => CategoryUncheckedUpdateWithoutUserInputSchema),
      ]),
      create: z.union([
        z.lazy(() => CategoryCreateWithoutUserInputSchema),
        z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.CategoryUpsertWithWhereUniqueWithoutUserInput>

export const CategoryUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CategoryUpdateWithWhereUniqueWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => CategoryWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => CategoryUpdateWithoutUserInputSchema),
        z.lazy(() => CategoryUncheckedUpdateWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateWithWhereUniqueWithoutUserInput>

export const CategoryUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithWhereWithoutUserInput> =
  z
    .object({
      where: z.lazy(() => CategoryScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => CategoryUpdateManyMutationInputSchema),
        z.lazy(() => CategoryUncheckedUpdateManyWithoutUserInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateManyWithWhereWithoutUserInput>

export const CategoryScalarWhereInputSchema: z.ZodType<Prisma.CategoryScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CategoryScalarWhereInputSchema),
        z.lazy(() => CategoryScalarWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CategoryScalarWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CategoryScalarWhereInputSchema),
        z.lazy(() => CategoryScalarWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    description: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryScalarWhereInput>

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
      categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateWithoutSessionsInput>

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput>

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutSessionsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput>

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutSessionsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutSessionsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpsertWithoutSessionsInput>

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutSessionsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput>

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
      categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateWithoutSessionsInput>

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput>

export const CategoryCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryCreateWithoutBookmarksInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      description: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      user: z.lazy(() => UserCreateNestedOneWithoutCategoriesInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryCreateWithoutBookmarksInput>

export const CategoryUncheckedCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutBookmarksInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      description: z.string().optional().nullable(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUncheckedCreateWithoutBookmarksInput>

export const CategoryCreateOrConnectWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutBookmarksInput> =
  z
    .object({
      where: z.lazy(() => CategoryWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => CategoryCreateWithoutBookmarksInputSchema),
        z.lazy(() => CategoryUncheckedCreateWithoutBookmarksInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.CategoryCreateOrConnectWithoutBookmarksInput>

export const TagsOnBookmarksCreateWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateWithoutBookmarkInput> =
  z
    .object({
      tag: z.lazy(() => TagCreateNestedOneWithoutBookmarksInputSchema),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateWithoutBookmarkInput>

export const TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateWithoutBookmarkInput> =
  z
    .object({
      tagId: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateWithoutBookmarkInput>

export const TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateOrConnectWithoutBookmarkInput> =
  z
    .object({
      where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateOrConnectWithoutBookmarkInput>

export const TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyBookmarkInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputSchema),
        z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateManyBookmarkInputEnvelope>

export const UserCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.UserCreateWithoutBookmarksInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
      categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateWithoutBookmarksInput>

export const UserUncheckedCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutBookmarksInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutBookmarksInput>

export const UserCreateOrConnectWithoutBookmarksInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutBookmarksInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutBookmarksInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutBookmarksInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutBookmarksInput>

export const CategoryUpsertWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutBookmarksInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => CategoryUpdateWithoutBookmarksInputSchema),
        z.lazy(() => CategoryUncheckedUpdateWithoutBookmarksInputSchema),
      ]),
      create: z.union([
        z.lazy(() => CategoryCreateWithoutBookmarksInputSchema),
        z.lazy(() => CategoryUncheckedCreateWithoutBookmarksInputSchema),
      ]),
      where: z.lazy(() => CategoryWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUpsertWithoutBookmarksInput>

export const CategoryUpdateToOneWithWhereWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutBookmarksInput> =
  z
    .object({
      where: z.lazy(() => CategoryWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => CategoryUpdateWithoutBookmarksInputSchema),
        z.lazy(() => CategoryUncheckedUpdateWithoutBookmarksInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutBookmarksInput>

export const CategoryUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutBookmarksInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      user: z.lazy(() => UserUpdateOneWithoutCategoriesNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateWithoutBookmarksInput>

export const CategoryUncheckedUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutBookmarksInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUncheckedUpdateWithoutBookmarksInput>

export const TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInput> =
  z
    .object({
      where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => TagsOnBookmarksUpdateWithoutBookmarkInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedUpdateWithoutBookmarkInputSchema),
      ]),
      create: z.union([
        z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInput>

export const TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInput> =
  z
    .object({
      where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => TagsOnBookmarksUpdateWithoutBookmarkInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedUpdateWithoutBookmarkInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInput>

export const TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInput> =
  z
    .object({
      where: z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => TagsOnBookmarksUpdateManyMutationInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInput>

export const TagsOnBookmarksScalarWhereInputSchema: z.ZodType<Prisma.TagsOnBookmarksScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => TagsOnBookmarksScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
          z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array(),
        ])
        .optional(),
      bookmarkId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      tagId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksScalarWhereInput>

export const UserUpsertWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUpsertWithoutBookmarksInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutBookmarksInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutBookmarksInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutBookmarksInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpsertWithoutBookmarksInput>

export const UserUpdateToOneWithWhereWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutBookmarksInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutBookmarksInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutBookmarksInput>

export const UserUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUpdateWithoutBookmarksInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
      categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateWithoutBookmarksInput>

export const UserUncheckedUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutBookmarksInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutBookmarksInput>

export const BookmarkCreateWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkCreateWithoutTagsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      title: z.string().optional().nullable(),
      url: z.string(),
      image: z.string().optional().nullable(),
      imageBlur: z.string().optional().nullable(),
      desc: z.string().optional().nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      category: z.lazy(() => CategoryCreateNestedOneWithoutBookmarksInputSchema).optional(),
      user: z.lazy(() => UserCreateNestedOneWithoutBookmarksInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateWithoutTagsInput>

export const BookmarkUncheckedCreateWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateWithoutTagsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      title: z.string().optional().nullable(),
      url: z.string(),
      image: z.string().optional().nullable(),
      imageBlur: z.string().optional().nullable(),
      desc: z.string().optional().nullable(),
      categoryId: z.string().optional().nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z.boolean().optional(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedCreateWithoutTagsInput>

export const BookmarkCreateOrConnectWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutTagsInput> =
  z
    .object({
      where: z.lazy(() => BookmarkWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => BookmarkCreateWithoutTagsInputSchema),
        z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateOrConnectWithoutTagsInput>

export const TagCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.TagCreateWithoutBookmarksInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      user: z.lazy(() => UserCreateNestedOneWithoutTagsInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagCreateWithoutBookmarksInput>

export const TagUncheckedCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutBookmarksInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.TagUncheckedCreateWithoutBookmarksInput>

export const TagCreateOrConnectWithoutBookmarksInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutBookmarksInput> =
  z
    .object({
      where: z.lazy(() => TagWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => TagCreateWithoutBookmarksInputSchema),
        z.lazy(() => TagUncheckedCreateWithoutBookmarksInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagCreateOrConnectWithoutBookmarksInput>

export const BookmarkUpsertWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUpsertWithoutTagsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => BookmarkUpdateWithoutTagsInputSchema),
        z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => BookmarkCreateWithoutTagsInputSchema),
        z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputSchema),
      ]),
      where: z.lazy(() => BookmarkWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpsertWithoutTagsInput>

export const BookmarkUpdateToOneWithWhereWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUpdateToOneWithWhereWithoutTagsInput> =
  z
    .object({
      where: z.lazy(() => BookmarkWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => BookmarkUpdateWithoutTagsInputSchema),
        z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateToOneWithWhereWithoutTagsInput>

export const BookmarkUpdateWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUpdateWithoutTagsInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      category: z.lazy(() => CategoryUpdateOneWithoutBookmarksNestedInputSchema).optional(),
      user: z.lazy(() => UserUpdateOneWithoutBookmarksNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateWithoutTagsInput>

export const BookmarkUncheckedUpdateWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutTagsInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      categoryId: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutTagsInput>

export const TagUpsertWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUpsertWithoutBookmarksInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => TagUpdateWithoutBookmarksInputSchema),
        z.lazy(() => TagUncheckedUpdateWithoutBookmarksInputSchema),
      ]),
      create: z.union([
        z.lazy(() => TagCreateWithoutBookmarksInputSchema),
        z.lazy(() => TagUncheckedCreateWithoutBookmarksInputSchema),
      ]),
      where: z.lazy(() => TagWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagUpsertWithoutBookmarksInput>

export const TagUpdateToOneWithWhereWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUpdateToOneWithWhereWithoutBookmarksInput> =
  z
    .object({
      where: z.lazy(() => TagWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => TagUpdateWithoutBookmarksInputSchema),
        z.lazy(() => TagUncheckedUpdateWithoutBookmarksInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagUpdateToOneWithWhereWithoutBookmarksInput>

export const TagUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUpdateWithoutBookmarksInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      user: z.lazy(() => UserUpdateOneWithoutTagsNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagUpdateWithoutBookmarksInput>

export const TagUncheckedUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutBookmarksInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagUncheckedUpdateWithoutBookmarksInput>

export const TagsOnBookmarksCreateWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateWithoutTagInput> =
  z
    .object({
      bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutTagsInputSchema),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateWithoutTagInput>

export const TagsOnBookmarksUncheckedCreateWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateWithoutTagInput> =
  z
    .object({
      bookmarkId: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateWithoutTagInput>

export const TagsOnBookmarksCreateOrConnectWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateOrConnectWithoutTagInput> =
  z
    .object({
      where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateOrConnectWithoutTagInput>

export const TagsOnBookmarksCreateManyTagInputEnvelopeSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyTagInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => TagsOnBookmarksCreateManyTagInputSchema),
        z.lazy(() => TagsOnBookmarksCreateManyTagInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateManyTagInputEnvelope>

export const UserCreateWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateWithoutTagsInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    emailVerified: z.coerce.date().optional().nullable(),
    image: z.string().optional().nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z.coerce.date().optional(),
    accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
    sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
    feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
    categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserCreateWithoutTagsInput>

export const UserUncheckedCreateWithoutTagsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTagsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutTagsInput>

export const UserCreateOrConnectWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTagsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutTagsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutTagsInput>

export const TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInput> =
  z
    .object({
      where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => TagsOnBookmarksUpdateWithoutTagInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedUpdateWithoutTagInputSchema),
      ]),
      create: z.union([
        z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInput>

export const TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInput> =
  z
    .object({
      where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => TagsOnBookmarksUpdateWithoutTagInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedUpdateWithoutTagInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInput>

export const TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithWhereWithoutTagInput> =
  z
    .object({
      where: z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => TagsOnBookmarksUpdateManyMutationInputSchema),
        z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutTagInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithWhereWithoutTagInput>

export const UserUpsertWithoutTagsInputSchema: z.ZodType<Prisma.UserUpsertWithoutTagsInput> = z
  .object({
    update: z.union([
      z.lazy(() => UserUpdateWithoutTagsInputSchema),
      z.lazy(() => UserUncheckedUpdateWithoutTagsInputSchema),
    ]),
    create: z.union([
      z.lazy(() => UserCreateWithoutTagsInputSchema),
      z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema),
    ]),
    where: z.lazy(() => UserWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserUpsertWithoutTagsInput>

export const UserUpdateToOneWithWhereWithoutTagsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTagsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutTagsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutTagsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTagsInput>

export const UserUpdateWithoutTagsInputSchema: z.ZodType<Prisma.UserUpdateWithoutTagsInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    email: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    emailVerified: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    image: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
    sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
    feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
    categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserUpdateWithoutTagsInput>

export const UserUncheckedUpdateWithoutTagsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTagsInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutTagsInput>

export const BookmarkCreateWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkCreateWithoutCategoryInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      title: z.string().optional().nullable(),
      url: z.string(),
      image: z.string().optional().nullable(),
      imageBlur: z.string().optional().nullable(),
      desc: z.string().optional().nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      tags: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutBookmarkInputSchema).optional(),
      user: z.lazy(() => UserCreateNestedOneWithoutBookmarksInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateWithoutCategoryInput>

export const BookmarkUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateWithoutCategoryInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      title: z.string().optional().nullable(),
      url: z.string(),
      image: z.string().optional().nullable(),
      imageBlur: z.string().optional().nullable(),
      desc: z.string().optional().nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z.boolean().optional(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      tags: z
        .lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedCreateWithoutCategoryInput>

export const BookmarkCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutCategoryInput> =
  z
    .object({
      where: z.lazy(() => BookmarkWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),
        z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateOrConnectWithoutCategoryInput>

export const BookmarkCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.BookmarkCreateManyCategoryInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => BookmarkCreateManyCategoryInputSchema),
        z.lazy(() => BookmarkCreateManyCategoryInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateManyCategoryInputEnvelope>

export const UserCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.UserCreateWithoutCategoriesInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateWithoutCategoriesInput>

export const UserUncheckedCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCategoriesInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutCategoriesInput>

export const UserCreateOrConnectWithoutCategoriesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCategoriesInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutCategoriesInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutCategoriesInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutCategoriesInput>

export const BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutCategoryInput> =
  z
    .object({
      where: z.lazy(() => BookmarkWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => BookmarkUpdateWithoutCategoryInputSchema),
        z.lazy(() => BookmarkUncheckedUpdateWithoutCategoryInputSchema),
      ]),
      create: z.union([
        z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),
        z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutCategoryInput>

export const BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutCategoryInput> =
  z
    .object({
      where: z.lazy(() => BookmarkWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => BookmarkUpdateWithoutCategoryInputSchema),
        z.lazy(() => BookmarkUncheckedUpdateWithoutCategoryInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutCategoryInput>

export const BookmarkUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUpdateManyWithWhereWithoutCategoryInput> =
  z
    .object({
      where: z.lazy(() => BookmarkScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => BookmarkUpdateManyMutationInputSchema),
        z.lazy(() => BookmarkUncheckedUpdateManyWithoutCategoryInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateManyWithWhereWithoutCategoryInput>

export const UserUpsertWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUpsertWithoutCategoriesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutCategoriesInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutCategoriesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutCategoriesInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutCategoriesInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpsertWithoutCategoriesInput>

export const UserUpdateToOneWithWhereWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCategoriesInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutCategoriesInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutCategoriesInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCategoriesInput>

export const UserUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUpdateWithoutCategoriesInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateWithoutCategoriesInput>

export const UserUncheckedUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCategoriesInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutCategoriesInput>

export const UserCreateWithoutFeedsInputSchema: z.ZodType<Prisma.UserCreateWithoutFeedsInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    emailVerified: z.coerce.date().optional().nullable(),
    image: z.string().optional().nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z.coerce.date().optional(),
    accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
    sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
    tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
    categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserCreateWithoutFeedsInput>

export const UserUncheckedCreateWithoutFeedsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFeedsInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutFeedsInput>

export const UserCreateOrConnectWithoutFeedsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFeedsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutFeedsInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutFeedsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutFeedsInput>

export const FeedEntryCreateWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryCreateWithoutFeedInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      guid: z.string().optional().nullable(),
      title: z.string(),
      link: z.string(),
      content: z.string().optional().nullable(),
      contentSnippet: z.string().optional().nullable(),
      author: z.string().optional().nullable(),
      ingested: z.coerce.date().optional().nullable(),
      published: z.coerce.date().optional().nullable(),
      unread: z.boolean().optional(),
      categories: z
        .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      user: z.lazy(() => UserCreateNestedOneWithoutFeedEntriesInputSchema),
      feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutFeedEntryInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateWithoutFeedInput>

export const FeedEntryUncheckedCreateWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutFeedInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      guid: z.string().optional().nullable(),
      title: z.string(),
      link: z.string(),
      content: z.string().optional().nullable(),
      contentSnippet: z.string().optional().nullable(),
      author: z.string().optional().nullable(),
      ingested: z.coerce.date().optional().nullable(),
      published: z.coerce.date().optional().nullable(),
      unread: z.boolean().optional(),
      categories: z
        .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
        .optional(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutFeedInput>

export const FeedEntryCreateOrConnectWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutFeedInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),
        z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutFeedInput>

export const FeedEntryCreateManyFeedInputEnvelopeSchema: z.ZodType<Prisma.FeedEntryCreateManyFeedInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => FeedEntryCreateManyFeedInputSchema),
        z.lazy(() => FeedEntryCreateManyFeedInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateManyFeedInputEnvelope>

export const UserUpsertWithoutFeedsInputSchema: z.ZodType<Prisma.UserUpsertWithoutFeedsInput> = z
  .object({
    update: z.union([
      z.lazy(() => UserUpdateWithoutFeedsInputSchema),
      z.lazy(() => UserUncheckedUpdateWithoutFeedsInputSchema),
    ]),
    create: z.union([
      z.lazy(() => UserCreateWithoutFeedsInputSchema),
      z.lazy(() => UserUncheckedCreateWithoutFeedsInputSchema),
    ]),
    where: z.lazy(() => UserWhereInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserUpsertWithoutFeedsInput>

export const UserUpdateToOneWithWhereWithoutFeedsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedsInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutFeedsInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutFeedsInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedsInput>

export const UserUpdateWithoutFeedsInputSchema: z.ZodType<Prisma.UserUpdateWithoutFeedsInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    email: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    emailVerified: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    image: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    settings: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
    sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
    bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
    tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
    feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
    feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
    categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.UserUpdateWithoutFeedsInput>

export const UserUncheckedUpdateWithoutFeedsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedsInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedsInput>

export const FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUpsertWithWhereUniqueWithoutFeedInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => FeedEntryUpdateWithoutFeedInputSchema),
        z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedInputSchema),
      ]),
      create: z.union([
        z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),
        z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpsertWithWhereUniqueWithoutFeedInput>

export const FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithWhereUniqueWithoutFeedInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => FeedEntryUpdateWithoutFeedInputSchema),
        z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateWithWhereUniqueWithoutFeedInput>

export const FeedEntryUpdateManyWithWhereWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyWithWhereWithoutFeedInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => FeedEntryUpdateManyMutationInputSchema),
        z.lazy(() => FeedEntryUncheckedUpdateManyWithoutFeedInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateManyWithWhereWithoutFeedInput>

export const FeedCreateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedCreateWithoutFeedEntriesInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      url: z.string(),
      description: z.string().optional().nullable(),
      language: z.string().optional().nullable(),
      copyright: z.string().optional().nullable(),
      lastFetched: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      user: z.lazy(() => UserCreateNestedOneWithoutFeedsInputSchema),
    })
    .strict() as z.ZodType<Prisma.FeedCreateWithoutFeedEntriesInput>

export const FeedUncheckedCreateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUncheckedCreateWithoutFeedEntriesInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string(),
      url: z.string(),
      description: z.string().optional().nullable(),
      language: z.string().optional().nullable(),
      copyright: z.string().optional().nullable(),
      userId: z.string(),
      lastFetched: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUncheckedCreateWithoutFeedEntriesInput>

export const FeedCreateOrConnectWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedCreateOrConnectWithoutFeedEntriesInput> =
  z
    .object({
      where: z.lazy(() => FeedWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => FeedCreateWithoutFeedEntriesInputSchema),
        z.lazy(() => FeedUncheckedCreateWithoutFeedEntriesInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedCreateOrConnectWithoutFeedEntriesInput>

export const UserCreateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserCreateWithoutFeedEntriesInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
      categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateWithoutFeedEntriesInput>

export const UserUncheckedCreateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFeedEntriesInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutFeedEntriesInput>

export const UserCreateOrConnectWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFeedEntriesInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutFeedEntriesInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutFeedEntriesInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutFeedEntriesInput>

export const FeedEntryMediaCreateWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateWithoutFeedEntryInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      href: z.string(),
      title: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      user: z.lazy(() => UserCreateNestedOneWithoutFeedMediaInputSchema),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateWithoutFeedEntryInput>

export const FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateWithoutFeedEntryInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      href: z.string(),
      title: z.string().optional().nullable(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedCreateWithoutFeedEntryInput>

export const FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateOrConnectWithoutFeedEntryInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateOrConnectWithoutFeedEntryInput>

export const FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyFeedEntryInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputSchema),
        z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateManyFeedEntryInputEnvelope>

export const FeedUpsertWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUpsertWithoutFeedEntriesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => FeedUpdateWithoutFeedEntriesInputSchema),
        z.lazy(() => FeedUncheckedUpdateWithoutFeedEntriesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => FeedCreateWithoutFeedEntriesInputSchema),
        z.lazy(() => FeedUncheckedCreateWithoutFeedEntriesInputSchema),
      ]),
      where: z.lazy(() => FeedWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUpsertWithoutFeedEntriesInput>

export const FeedUpdateToOneWithWhereWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUpdateToOneWithWhereWithoutFeedEntriesInput> =
  z
    .object({
      where: z.lazy(() => FeedWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => FeedUpdateWithoutFeedEntriesInputSchema),
        z.lazy(() => FeedUncheckedUpdateWithoutFeedEntriesInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedUpdateToOneWithWhereWithoutFeedEntriesInput>

export const FeedUpdateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUpdateWithoutFeedEntriesInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      language: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      copyright: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      lastFetched: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      user: z.lazy(() => UserUpdateOneRequiredWithoutFeedsNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUpdateWithoutFeedEntriesInput>

export const FeedUncheckedUpdateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateWithoutFeedEntriesInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      language: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      copyright: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      lastFetched: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUncheckedUpdateWithoutFeedEntriesInput>

export const UserUpsertWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUpsertWithoutFeedEntriesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutFeedEntriesInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutFeedEntriesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutFeedEntriesInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutFeedEntriesInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpsertWithoutFeedEntriesInput>

export const UserUpdateToOneWithWhereWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedEntriesInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutFeedEntriesInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutFeedEntriesInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedEntriesInput>

export const UserUpdateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUpdateWithoutFeedEntriesInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
      categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateWithoutFeedEntriesInput>

export const UserUncheckedUpdateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedEntriesInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedEntriesInput>

export const FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => FeedEntryMediaUpdateWithoutFeedEntryInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedUpdateWithoutFeedEntryInputSchema),
      ]),
      create: z.union([
        z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInput>

export const FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => FeedEntryMediaUpdateWithoutFeedEntryInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedUpdateWithoutFeedEntryInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInput>

export const FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => FeedEntryMediaUpdateManyMutationInputSchema),
        z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInput>

export const FeedEntryCreateWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryCreateWithoutFeedMediaInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      guid: z.string().optional().nullable(),
      title: z.string(),
      link: z.string(),
      content: z.string().optional().nullable(),
      contentSnippet: z.string().optional().nullable(),
      author: z.string().optional().nullable(),
      ingested: z.coerce.date().optional().nullable(),
      published: z.coerce.date().optional().nullable(),
      unread: z.boolean().optional(),
      categories: z
        .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
        .optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      feed: z.lazy(() => FeedCreateNestedOneWithoutFeedEntriesInputSchema),
      user: z.lazy(() => UserCreateNestedOneWithoutFeedEntriesInputSchema),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateWithoutFeedMediaInput>

export const FeedEntryUncheckedCreateWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutFeedMediaInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      guid: z.string().optional().nullable(),
      title: z.string(),
      link: z.string(),
      content: z.string().optional().nullable(),
      contentSnippet: z.string().optional().nullable(),
      author: z.string().optional().nullable(),
      ingested: z.coerce.date().optional().nullable(),
      published: z.coerce.date().optional().nullable(),
      unread: z.boolean().optional(),
      categories: z
        .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
        .optional(),
      feedId: z.string(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutFeedMediaInput>

export const FeedEntryCreateOrConnectWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutFeedMediaInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => FeedEntryCreateWithoutFeedMediaInputSchema),
        z.lazy(() => FeedEntryUncheckedCreateWithoutFeedMediaInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutFeedMediaInput>

export const UserCreateWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserCreateWithoutFeedMediaInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
      categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserCreateWithoutFeedMediaInput>

export const UserUncheckedCreateWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFeedMediaInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      emailVerified: z.coerce.date().optional().nullable(),
      image: z.string().optional().nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z.coerce.date().optional(),
      accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutFeedMediaInput>

export const UserCreateOrConnectWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFeedMediaInput> =
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutFeedMediaInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutFeedMediaInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutFeedMediaInput>

export const FeedEntryUpsertWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUpsertWithoutFeedMediaInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => FeedEntryUpdateWithoutFeedMediaInputSchema),
        z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedMediaInputSchema),
      ]),
      create: z.union([
        z.lazy(() => FeedEntryCreateWithoutFeedMediaInputSchema),
        z.lazy(() => FeedEntryUncheckedCreateWithoutFeedMediaInputSchema),
      ]),
      where: z.lazy(() => FeedEntryWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpsertWithoutFeedMediaInput>

export const FeedEntryUpdateToOneWithWhereWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUpdateToOneWithWhereWithoutFeedMediaInput> =
  z
    .object({
      where: z.lazy(() => FeedEntryWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => FeedEntryUpdateWithoutFeedMediaInputSchema),
        z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedMediaInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateToOneWithWhereWithoutFeedMediaInput>

export const FeedEntryUpdateWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithoutFeedMediaInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      feed: z.lazy(() => FeedUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
      user: z.lazy(() => UserUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateWithoutFeedMediaInput>

export const FeedEntryUncheckedUpdateWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutFeedMediaInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      feedId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutFeedMediaInput>

export const UserUpsertWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUpsertWithoutFeedMediaInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutFeedMediaInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutFeedMediaInputSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutFeedMediaInputSchema),
        z.lazy(() => UserUncheckedCreateWithoutFeedMediaInputSchema),
      ]),
      where: z.lazy(() => UserWhereInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpsertWithoutFeedMediaInput>

export const UserUpdateToOneWithWhereWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedMediaInput> =
  z
    .object({
      where: z.lazy(() => UserWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutFeedMediaInputSchema),
        z.lazy(() => UserUncheckedUpdateWithoutFeedMediaInputSchema),
      ]),
    })
    .strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedMediaInput>

export const UserUpdateWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUpdateWithoutFeedMediaInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
      categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUpdateWithoutFeedMediaInput>

export const UserUncheckedUpdateWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedMediaInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      email: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      emailVerified: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      settings: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema)
        .optional(),
      categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedMediaInput>

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string().optional().nullable(),
    access_token: z.string().optional().nullable(),
    expires_at: z.number().int().optional().nullable(),
    token_type: z.string().optional().nullable(),
    scope: z.string().optional().nullable(),
    id_token: z.string().optional().nullable(),
    session_state: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.AccountCreateManyUserInput>

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    sessionToken: z.string(),
    expires: z.coerce.date(),
  })
  .strict() as z.ZodType<Prisma.SessionCreateManyUserInput>

export const BookmarkCreateManyUserInputSchema: z.ZodType<Prisma.BookmarkCreateManyUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    title: z.string().optional().nullable(),
    url: z.string(),
    image: z.string().optional().nullable(),
    imageBlur: z.string().optional().nullable(),
    desc: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    metadata: z
      .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    archived: z.boolean().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkCreateManyUserInput>

export const TagCreateManyUserInputSchema: z.ZodType<Prisma.TagCreateManyUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.TagCreateManyUserInput>

export const FeedCreateManyUserInputSchema: z.ZodType<Prisma.FeedCreateManyUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    url: z.string(),
    description: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    copyright: z.string().optional().nullable(),
    lastFetched: z.coerce.date().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedCreateManyUserInput>

export const FeedEntryCreateManyUserInputSchema: z.ZodType<Prisma.FeedEntryCreateManyUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    guid: z.string().optional().nullable(),
    title: z.string(),
    link: z.string(),
    content: z.string().optional().nullable(),
    contentSnippet: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
    ingested: z.coerce.date().optional().nullable(),
    published: z.coerce.date().optional().nullable(),
    unread: z.boolean().optional(),
    categories: z
      .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
      .optional(),
    feedId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryCreateManyUserInput>

export const FeedEntryMediaCreateManyUserInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyUserInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      href: z.string(),
      title: z.string().optional().nullable(),
      feedEntryId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateManyUserInput>

export const CategoryCreateManyUserInputSchema: z.ZodType<Prisma.CategoryCreateManyUserInput> = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string(),
    description: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryCreateManyUserInput>

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      provider: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      providerAccountId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      refresh_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      access_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      expires_at: z
        .union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      token_type: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      scope: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      id_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      session_state: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUpdateWithoutUserInput>

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      provider: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      providerAccountId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      refresh_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      access_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      expires_at: z
        .union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      token_type: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      scope: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      id_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      session_state: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput>

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      provider: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      providerAccountId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      refresh_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      access_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      expires_at: z
        .union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      token_type: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      scope: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      id_token: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      session_state: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput>

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      sessionToken: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      expires: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUpdateWithoutUserInput>

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      sessionToken: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      expires: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput>

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      sessionToken: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      expires: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput>

export const BookmarkUpdateWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      category: z.lazy(() => CategoryUpdateOneWithoutBookmarksNestedInputSchema).optional(),
      tags: z.lazy(() => TagsOnBookmarksUpdateManyWithoutBookmarkNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateWithoutUserInput>

export const BookmarkUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      categoryId: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      tags: z
        .lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutUserInput>

export const BookmarkUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      categoryId: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutUserInput>

export const TagUpdateWithoutUserInputSchema: z.ZodType<Prisma.TagUpdateWithoutUserInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    bookmarks: z.lazy(() => TagsOnBookmarksUpdateManyWithoutTagNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.TagUpdateWithoutUserInput>

export const TagUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      bookmarks: z
        .lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagUncheckedUpdateWithoutUserInput>

export const TagUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUserInput>

export const FeedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedUpdateWithoutUserInput> = z
  .object({
    id: z
      .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    description: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    language: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    copyright: z
      .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    lastFetched: z
      .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    updatedAt: z
      .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
      .optional(),
    feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutFeedNestedInputSchema).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedUpdateWithoutUserInput>

export const FeedUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      language: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      copyright: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      lastFetched: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      feedEntries: z
        .lazy(() => FeedEntryUncheckedUpdateManyWithoutFeedNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUncheckedUpdateWithoutUserInput>

export const FeedUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      language: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      copyright: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      lastFetched: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedUncheckedUpdateManyWithoutUserInput>

export const FeedEntryUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      feed: z.lazy(() => FeedUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutFeedEntryNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateWithoutUserInput>

export const FeedEntryUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      feedId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutUserInput>

export const FeedEntryUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      feedId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutUserInput>

export const FeedEntryMediaUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      feedEntry: z
        .lazy(() => FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateWithoutUserInput>

export const FeedEntryMediaUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      feedEntryId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateWithoutUserInput>

export const FeedEntryMediaUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      feedEntryId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutUserInput>

export const CategoryUpdateWithoutUserInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      bookmarks: z.lazy(() => BookmarkUpdateManyWithoutCategoryNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateWithoutUserInput>

export const CategoryUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      bookmarks: z
        .lazy(() => BookmarkUncheckedUpdateManyWithoutCategoryNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUncheckedUpdateWithoutUserInput>

export const CategoryUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutUserInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      description: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutUserInput>

export const TagsOnBookmarksCreateManyBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyBookmarkInput> =
  z
    .object({
      tagId: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateManyBookmarkInput>

export const TagsOnBookmarksUpdateWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateWithoutBookmarkInput> =
  z
    .object({
      tag: z.lazy(() => TagUpdateOneRequiredWithoutBookmarksNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateWithoutBookmarkInput>

export const TagsOnBookmarksUncheckedUpdateWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateWithoutBookmarkInput> =
  z
    .object({
      tagId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateWithoutBookmarkInput>

export const TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkInput> =
  z
    .object({
      tagId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkInput>

export const TagsOnBookmarksCreateManyTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyTagInput> =
  z
    .object({
      bookmarkId: z.string(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateManyTagInput>

export const TagsOnBookmarksUpdateWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateWithoutTagInput> =
  z
    .object({
      bookmark: z.lazy(() => BookmarkUpdateOneRequiredWithoutTagsNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateWithoutTagInput>

export const TagsOnBookmarksUncheckedUpdateWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateWithoutTagInput> =
  z
    .object({
      bookmarkId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateWithoutTagInput>

export const TagsOnBookmarksUncheckedUpdateManyWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutTagInput> =
  z
    .object({
      bookmarkId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutTagInput>

export const BookmarkCreateManyCategoryInputSchema: z.ZodType<Prisma.BookmarkCreateManyCategoryInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      title: z.string().optional().nullable(),
      url: z.string(),
      image: z.string().optional().nullable(),
      imageBlur: z.string().optional().nullable(),
      desc: z.string().optional().nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z.boolean().optional(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateManyCategoryInput>

export const BookmarkUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUpdateWithoutCategoryInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      tags: z.lazy(() => TagsOnBookmarksUpdateManyWithoutBookmarkNestedInputSchema).optional(),
      user: z.lazy(() => UserUpdateOneWithoutBookmarksNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateWithoutCategoryInput>

export const BookmarkUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutCategoryInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      tags: z
        .lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutCategoryInput>

export const BookmarkUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutCategoryInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      image: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      imageBlur: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      desc: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      metadata: z
        .union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema])
        .optional(),
      archived: z
        .union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutCategoryInput>

export const FeedEntryCreateManyFeedInputSchema: z.ZodType<Prisma.FeedEntryCreateManyFeedInput> = z
  .object({
    id: z.string().cuid().optional(),
    guid: z.string().optional().nullable(),
    title: z.string(),
    link: z.string(),
    content: z.string().optional().nullable(),
    contentSnippet: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
    ingested: z.coerce.date().optional().nullable(),
    published: z.coerce.date().optional().nullable(),
    unread: z.boolean().optional(),
    categories: z
      .union([z.lazy(() => FeedEntryCreatecategoriesInputSchema), z.string().array()])
      .optional(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryCreateManyFeedInput>

export const FeedEntryUpdateWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithoutFeedInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      user: z.lazy(() => UserUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
      feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutFeedEntryNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateWithoutFeedInput>

export const FeedEntryUncheckedUpdateWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutFeedInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      feedMedia: z
        .lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInputSchema)
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutFeedInput>

export const FeedEntryUncheckedUpdateManyWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutFeedInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      guid: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      link: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      content: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      contentSnippet: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      author: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      ingested: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      published: z
        .union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      unread: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
      categories: z
        .union([z.lazy(() => FeedEntryUpdatecategoriesInputSchema), z.string().array()])
        .optional(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutFeedInput>

export const FeedEntryMediaCreateManyFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyFeedEntryInput> =
  z
    .object({
      id: z.string().cuid().optional(),
      href: z.string(),
      title: z.string().optional().nullable(),
      userId: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateManyFeedEntryInput>

export const FeedEntryMediaUpdateWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateWithoutFeedEntryInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      user: z.lazy(() => UserUpdateOneRequiredWithoutFeedMediaNestedInputSchema).optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateWithoutFeedEntryInput>

export const FeedEntryMediaUncheckedUpdateWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateWithoutFeedEntryInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateWithoutFeedEntryInput>

export const FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryInput> =
  z
    .object({
      id: z
        .union([z.string().cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      href: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
      title: z
        .union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
        .optional()
        .nullable(),
      userId: z
        .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
        .optional(),
      createdAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
      updatedAt: z
        .union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryInput>

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereInputSchema.optional(),
    orderBy: z
      .union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
      .optional(),
    cursor: AccountWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.AccountFindFirstArgs>

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereInputSchema.optional(),
    orderBy: z
      .union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
      .optional(),
    cursor: AccountWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.AccountFindFirstOrThrowArgs>

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereInputSchema.optional(),
    orderBy: z
      .union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
      .optional(),
    cursor: AccountWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.AccountFindManyArgs>

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z
  .object({
    where: AccountWhereInputSchema.optional(),
    orderBy: z
      .union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
      .optional(),
    cursor: AccountWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.AccountAggregateArgs>

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z
  .object({
    where: AccountWhereInputSchema.optional(),
    orderBy: z
      .union([
        AccountOrderByWithAggregationInputSchema.array(),
        AccountOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: AccountScalarFieldEnumSchema.array(),
    having: AccountScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.AccountGroupByArgs>

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.AccountFindUniqueArgs>

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.AccountFindUniqueOrThrowArgs>

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
      .optional(),
    cursor: UserWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.UserFindFirstArgs>

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
      .optional(),
    cursor: UserWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.UserFindFirstOrThrowArgs>

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
      .optional(),
    cursor: UserWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.UserFindManyArgs>

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z
  .object({
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
      .optional(),
    cursor: UserWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.UserAggregateArgs>

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z
  .object({
    where: UserWhereInputSchema.optional(),
    orderBy: z
      .union([UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema])
      .optional(),
    by: UserScalarFieldEnumSchema.array(),
    having: UserScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.UserGroupByArgs>

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.UserFindUniqueArgs>

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.UserFindUniqueOrThrowArgs>

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereInputSchema.optional(),
    orderBy: z
      .union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
      .optional(),
    cursor: SessionWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.SessionFindFirstArgs>

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereInputSchema.optional(),
    orderBy: z
      .union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
      .optional(),
    cursor: SessionWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.SessionFindFirstOrThrowArgs>

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereInputSchema.optional(),
    orderBy: z
      .union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
      .optional(),
    cursor: SessionWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.SessionFindManyArgs>

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z
  .object({
    where: SessionWhereInputSchema.optional(),
    orderBy: z
      .union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
      .optional(),
    cursor: SessionWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.SessionAggregateArgs>

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z
  .object({
    where: SessionWhereInputSchema.optional(),
    orderBy: z
      .union([
        SessionOrderByWithAggregationInputSchema.array(),
        SessionOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: SessionScalarFieldEnumSchema.array(),
    having: SessionScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.SessionGroupByArgs>

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.SessionFindUniqueArgs>

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.SessionFindUniqueOrThrowArgs>

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithRelationInputSchema.array(),
          VerificationTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: VerificationTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          VerificationTokenScalarFieldEnumSchema,
          VerificationTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenFindFirstArgs>

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithRelationInputSchema.array(),
          VerificationTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: VerificationTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          VerificationTokenScalarFieldEnumSchema,
          VerificationTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs>

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithRelationInputSchema.array(),
          VerificationTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: VerificationTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          VerificationTokenScalarFieldEnumSchema,
          VerificationTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenFindManyArgs>

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> =
  z
    .object({
      where: VerificationTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          VerificationTokenOrderByWithRelationInputSchema.array(),
          VerificationTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: VerificationTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenAggregateArgs>

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> = z
  .object({
    where: VerificationTokenWhereInputSchema.optional(),
    orderBy: z
      .union([
        VerificationTokenOrderByWithAggregationInputSchema.array(),
        VerificationTokenOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: VerificationTokenScalarFieldEnumSchema.array(),
    having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.VerificationTokenGroupByArgs>

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereUniqueInputSchema,
    })
    .strict() as z.ZodType<Prisma.VerificationTokenFindUniqueArgs>

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> =
  z
    .object({
      select: VerificationTokenSelectSchema.optional(),
      where: VerificationTokenWhereUniqueInputSchema,
    })
    .strict() as z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs>

export const BookmarkFindFirstArgsSchema: z.ZodType<Prisma.BookmarkFindFirstArgs> = z
  .object({
    select: BookmarkSelectSchema.optional(),
    include: BookmarkIncludeSchema.optional(),
    where: BookmarkWhereInputSchema.optional(),
    orderBy: z
      .union([
        BookmarkOrderByWithRelationInputSchema.array(),
        BookmarkOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: BookmarkWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([BookmarkScalarFieldEnumSchema, BookmarkScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkFindFirstArgs>

export const BookmarkFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BookmarkFindFirstOrThrowArgs> = z
  .object({
    select: BookmarkSelectSchema.optional(),
    include: BookmarkIncludeSchema.optional(),
    where: BookmarkWhereInputSchema.optional(),
    orderBy: z
      .union([
        BookmarkOrderByWithRelationInputSchema.array(),
        BookmarkOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: BookmarkWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([BookmarkScalarFieldEnumSchema, BookmarkScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkFindFirstOrThrowArgs>

export const BookmarkFindManyArgsSchema: z.ZodType<Prisma.BookmarkFindManyArgs> = z
  .object({
    select: BookmarkSelectSchema.optional(),
    include: BookmarkIncludeSchema.optional(),
    where: BookmarkWhereInputSchema.optional(),
    orderBy: z
      .union([
        BookmarkOrderByWithRelationInputSchema.array(),
        BookmarkOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: BookmarkWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([BookmarkScalarFieldEnumSchema, BookmarkScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkFindManyArgs>

export const BookmarkAggregateArgsSchema: z.ZodType<Prisma.BookmarkAggregateArgs> = z
  .object({
    where: BookmarkWhereInputSchema.optional(),
    orderBy: z
      .union([
        BookmarkOrderByWithRelationInputSchema.array(),
        BookmarkOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: BookmarkWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkAggregateArgs>

export const BookmarkGroupByArgsSchema: z.ZodType<Prisma.BookmarkGroupByArgs> = z
  .object({
    where: BookmarkWhereInputSchema.optional(),
    orderBy: z
      .union([
        BookmarkOrderByWithAggregationInputSchema.array(),
        BookmarkOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: BookmarkScalarFieldEnumSchema.array(),
    having: BookmarkScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkGroupByArgs>

export const BookmarkFindUniqueArgsSchema: z.ZodType<Prisma.BookmarkFindUniqueArgs> = z
  .object({
    select: BookmarkSelectSchema.optional(),
    include: BookmarkIncludeSchema.optional(),
    where: BookmarkWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.BookmarkFindUniqueArgs>

export const BookmarkFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BookmarkFindUniqueOrThrowArgs> =
  z
    .object({
      select: BookmarkSelectSchema.optional(),
      include: BookmarkIncludeSchema.optional(),
      where: BookmarkWhereUniqueInputSchema,
    })
    .strict() as z.ZodType<Prisma.BookmarkFindUniqueOrThrowArgs>

export const TagsOnBookmarksFindFirstArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindFirstArgs> = z
  .object({
    select: TagsOnBookmarksSelectSchema.optional(),
    include: TagsOnBookmarksIncludeSchema.optional(),
    where: TagsOnBookmarksWhereInputSchema.optional(),
    orderBy: z
      .union([
        TagsOnBookmarksOrderByWithRelationInputSchema.array(),
        TagsOnBookmarksOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: TagsOnBookmarksWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([TagsOnBookmarksScalarFieldEnumSchema, TagsOnBookmarksScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksFindFirstArgs>

export const TagsOnBookmarksFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindFirstOrThrowArgs> =
  z
    .object({
      select: TagsOnBookmarksSelectSchema.optional(),
      include: TagsOnBookmarksIncludeSchema.optional(),
      where: TagsOnBookmarksWhereInputSchema.optional(),
      orderBy: z
        .union([
          TagsOnBookmarksOrderByWithRelationInputSchema.array(),
          TagsOnBookmarksOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: TagsOnBookmarksWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([TagsOnBookmarksScalarFieldEnumSchema, TagsOnBookmarksScalarFieldEnumSchema.array()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksFindFirstOrThrowArgs>

export const TagsOnBookmarksFindManyArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindManyArgs> = z
  .object({
    select: TagsOnBookmarksSelectSchema.optional(),
    include: TagsOnBookmarksIncludeSchema.optional(),
    where: TagsOnBookmarksWhereInputSchema.optional(),
    orderBy: z
      .union([
        TagsOnBookmarksOrderByWithRelationInputSchema.array(),
        TagsOnBookmarksOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: TagsOnBookmarksWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([TagsOnBookmarksScalarFieldEnumSchema, TagsOnBookmarksScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksFindManyArgs>

export const TagsOnBookmarksAggregateArgsSchema: z.ZodType<Prisma.TagsOnBookmarksAggregateArgs> = z
  .object({
    where: TagsOnBookmarksWhereInputSchema.optional(),
    orderBy: z
      .union([
        TagsOnBookmarksOrderByWithRelationInputSchema.array(),
        TagsOnBookmarksOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: TagsOnBookmarksWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksAggregateArgs>

export const TagsOnBookmarksGroupByArgsSchema: z.ZodType<Prisma.TagsOnBookmarksGroupByArgs> = z
  .object({
    where: TagsOnBookmarksWhereInputSchema.optional(),
    orderBy: z
      .union([
        TagsOnBookmarksOrderByWithAggregationInputSchema.array(),
        TagsOnBookmarksOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: TagsOnBookmarksScalarFieldEnumSchema.array(),
    having: TagsOnBookmarksScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksGroupByArgs>

export const TagsOnBookmarksFindUniqueArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindUniqueArgs> =
  z
    .object({
      select: TagsOnBookmarksSelectSchema.optional(),
      include: TagsOnBookmarksIncludeSchema.optional(),
      where: TagsOnBookmarksWhereUniqueInputSchema,
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksFindUniqueArgs>

export const TagsOnBookmarksFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindUniqueOrThrowArgs> =
  z
    .object({
      select: TagsOnBookmarksSelectSchema.optional(),
      include: TagsOnBookmarksIncludeSchema.optional(),
      where: TagsOnBookmarksWhereUniqueInputSchema,
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksFindUniqueOrThrowArgs>

export const TagFindFirstArgsSchema: z.ZodType<Prisma.TagFindFirstArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([TagOrderByWithRelationInputSchema.array(), TagOrderByWithRelationInputSchema])
      .optional(),
    cursor: TagWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([TagScalarFieldEnumSchema, TagScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.TagFindFirstArgs>

export const TagFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TagFindFirstOrThrowArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([TagOrderByWithRelationInputSchema.array(), TagOrderByWithRelationInputSchema])
      .optional(),
    cursor: TagWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([TagScalarFieldEnumSchema, TagScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.TagFindFirstOrThrowArgs>

export const TagFindManyArgsSchema: z.ZodType<Prisma.TagFindManyArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([TagOrderByWithRelationInputSchema.array(), TagOrderByWithRelationInputSchema])
      .optional(),
    cursor: TagWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([TagScalarFieldEnumSchema, TagScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.TagFindManyArgs>

export const TagAggregateArgsSchema: z.ZodType<Prisma.TagAggregateArgs> = z
  .object({
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([TagOrderByWithRelationInputSchema.array(), TagOrderByWithRelationInputSchema])
      .optional(),
    cursor: TagWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.TagAggregateArgs>

export const TagGroupByArgsSchema: z.ZodType<Prisma.TagGroupByArgs> = z
  .object({
    where: TagWhereInputSchema.optional(),
    orderBy: z
      .union([TagOrderByWithAggregationInputSchema.array(), TagOrderByWithAggregationInputSchema])
      .optional(),
    by: TagScalarFieldEnumSchema.array(),
    having: TagScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.TagGroupByArgs>

export const TagFindUniqueArgsSchema: z.ZodType<Prisma.TagFindUniqueArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.TagFindUniqueArgs>

export const TagFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TagFindUniqueOrThrowArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.TagFindUniqueOrThrowArgs>

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z
  .object({
    select: CategorySelectSchema.optional(),
    include: CategoryIncludeSchema.optional(),
    where: CategoryWhereInputSchema.optional(),
    orderBy: z
      .union([
        CategoryOrderByWithRelationInputSchema.array(),
        CategoryOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: CategoryWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryFindFirstArgs>

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z
  .object({
    select: CategorySelectSchema.optional(),
    include: CategoryIncludeSchema.optional(),
    where: CategoryWhereInputSchema.optional(),
    orderBy: z
      .union([
        CategoryOrderByWithRelationInputSchema.array(),
        CategoryOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: CategoryWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryFindFirstOrThrowArgs>

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z
  .object({
    select: CategorySelectSchema.optional(),
    include: CategoryIncludeSchema.optional(),
    where: CategoryWhereInputSchema.optional(),
    orderBy: z
      .union([
        CategoryOrderByWithRelationInputSchema.array(),
        CategoryOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: CategoryWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryFindManyArgs>

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z
  .object({
    where: CategoryWhereInputSchema.optional(),
    orderBy: z
      .union([
        CategoryOrderByWithRelationInputSchema.array(),
        CategoryOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: CategoryWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryAggregateArgs>

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z
  .object({
    where: CategoryWhereInputSchema.optional(),
    orderBy: z
      .union([
        CategoryOrderByWithAggregationInputSchema.array(),
        CategoryOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: CategoryScalarFieldEnumSchema.array(),
    having: CategoryScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryGroupByArgs>

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z
  .object({
    select: CategorySelectSchema.optional(),
    include: CategoryIncludeSchema.optional(),
    where: CategoryWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.CategoryFindUniqueArgs>

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> =
  z
    .object({
      select: CategorySelectSchema.optional(),
      include: CategoryIncludeSchema.optional(),
      where: CategoryWhereUniqueInputSchema,
    })
    .strict() as z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs>

export const FeedFindFirstArgsSchema: z.ZodType<Prisma.FeedFindFirstArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    where: FeedWhereInputSchema.optional(),
    orderBy: z
      .union([FeedOrderByWithRelationInputSchema.array(), FeedOrderByWithRelationInputSchema])
      .optional(),
    cursor: FeedWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([FeedScalarFieldEnumSchema, FeedScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedFindFirstArgs>

export const FeedFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FeedFindFirstOrThrowArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    where: FeedWhereInputSchema.optional(),
    orderBy: z
      .union([FeedOrderByWithRelationInputSchema.array(), FeedOrderByWithRelationInputSchema])
      .optional(),
    cursor: FeedWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([FeedScalarFieldEnumSchema, FeedScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedFindFirstOrThrowArgs>

export const FeedFindManyArgsSchema: z.ZodType<Prisma.FeedFindManyArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    where: FeedWhereInputSchema.optional(),
    orderBy: z
      .union([FeedOrderByWithRelationInputSchema.array(), FeedOrderByWithRelationInputSchema])
      .optional(),
    cursor: FeedWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([FeedScalarFieldEnumSchema, FeedScalarFieldEnumSchema.array()]).optional(),
  })
  .strict() as z.ZodType<Prisma.FeedFindManyArgs>

export const FeedAggregateArgsSchema: z.ZodType<Prisma.FeedAggregateArgs> = z
  .object({
    where: FeedWhereInputSchema.optional(),
    orderBy: z
      .union([FeedOrderByWithRelationInputSchema.array(), FeedOrderByWithRelationInputSchema])
      .optional(),
    cursor: FeedWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedAggregateArgs>

export const FeedGroupByArgsSchema: z.ZodType<Prisma.FeedGroupByArgs> = z
  .object({
    where: FeedWhereInputSchema.optional(),
    orderBy: z
      .union([FeedOrderByWithAggregationInputSchema.array(), FeedOrderByWithAggregationInputSchema])
      .optional(),
    by: FeedScalarFieldEnumSchema.array(),
    having: FeedScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedGroupByArgs>

export const FeedFindUniqueArgsSchema: z.ZodType<Prisma.FeedFindUniqueArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    where: FeedWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedFindUniqueArgs>

export const FeedFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FeedFindUniqueOrThrowArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    where: FeedWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedFindUniqueOrThrowArgs>

export const FeedEntryFindFirstArgsSchema: z.ZodType<Prisma.FeedEntryFindFirstArgs> = z
  .object({
    select: FeedEntrySelectSchema.optional(),
    include: FeedEntryIncludeSchema.optional(),
    where: FeedEntryWhereInputSchema.optional(),
    orderBy: z
      .union([
        FeedEntryOrderByWithRelationInputSchema.array(),
        FeedEntryOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: FeedEntryWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([FeedEntryScalarFieldEnumSchema, FeedEntryScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryFindFirstArgs>

export const FeedEntryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FeedEntryFindFirstOrThrowArgs> =
  z
    .object({
      select: FeedEntrySelectSchema.optional(),
      include: FeedEntryIncludeSchema.optional(),
      where: FeedEntryWhereInputSchema.optional(),
      orderBy: z
        .union([
          FeedEntryOrderByWithRelationInputSchema.array(),
          FeedEntryOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: FeedEntryWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([FeedEntryScalarFieldEnumSchema, FeedEntryScalarFieldEnumSchema.array()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryFindFirstOrThrowArgs>

export const FeedEntryFindManyArgsSchema: z.ZodType<Prisma.FeedEntryFindManyArgs> = z
  .object({
    select: FeedEntrySelectSchema.optional(),
    include: FeedEntryIncludeSchema.optional(),
    where: FeedEntryWhereInputSchema.optional(),
    orderBy: z
      .union([
        FeedEntryOrderByWithRelationInputSchema.array(),
        FeedEntryOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: FeedEntryWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([FeedEntryScalarFieldEnumSchema, FeedEntryScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryFindManyArgs>

export const FeedEntryAggregateArgsSchema: z.ZodType<Prisma.FeedEntryAggregateArgs> = z
  .object({
    where: FeedEntryWhereInputSchema.optional(),
    orderBy: z
      .union([
        FeedEntryOrderByWithRelationInputSchema.array(),
        FeedEntryOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: FeedEntryWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryAggregateArgs>

export const FeedEntryGroupByArgsSchema: z.ZodType<Prisma.FeedEntryGroupByArgs> = z
  .object({
    where: FeedEntryWhereInputSchema.optional(),
    orderBy: z
      .union([
        FeedEntryOrderByWithAggregationInputSchema.array(),
        FeedEntryOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: FeedEntryScalarFieldEnumSchema.array(),
    having: FeedEntryScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryGroupByArgs>

export const FeedEntryFindUniqueArgsSchema: z.ZodType<Prisma.FeedEntryFindUniqueArgs> = z
  .object({
    select: FeedEntrySelectSchema.optional(),
    include: FeedEntryIncludeSchema.optional(),
    where: FeedEntryWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedEntryFindUniqueArgs>

export const FeedEntryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FeedEntryFindUniqueOrThrowArgs> =
  z
    .object({
      select: FeedEntrySelectSchema.optional(),
      include: FeedEntryIncludeSchema.optional(),
      where: FeedEntryWhereUniqueInputSchema,
    })
    .strict() as z.ZodType<Prisma.FeedEntryFindUniqueOrThrowArgs>

export const FeedEntryMediaFindFirstArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindFirstArgs> = z
  .object({
    select: FeedEntryMediaSelectSchema.optional(),
    include: FeedEntryMediaIncludeSchema.optional(),
    where: FeedEntryMediaWhereInputSchema.optional(),
    orderBy: z
      .union([
        FeedEntryMediaOrderByWithRelationInputSchema.array(),
        FeedEntryMediaOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: FeedEntryMediaWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([FeedEntryMediaScalarFieldEnumSchema, FeedEntryMediaScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaFindFirstArgs>

export const FeedEntryMediaFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindFirstOrThrowArgs> =
  z
    .object({
      select: FeedEntryMediaSelectSchema.optional(),
      include: FeedEntryMediaIncludeSchema.optional(),
      where: FeedEntryMediaWhereInputSchema.optional(),
      orderBy: z
        .union([
          FeedEntryMediaOrderByWithRelationInputSchema.array(),
          FeedEntryMediaOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: FeedEntryMediaWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([FeedEntryMediaScalarFieldEnumSchema, FeedEntryMediaScalarFieldEnumSchema.array()])
        .optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaFindFirstOrThrowArgs>

export const FeedEntryMediaFindManyArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindManyArgs> = z
  .object({
    select: FeedEntryMediaSelectSchema.optional(),
    include: FeedEntryMediaIncludeSchema.optional(),
    where: FeedEntryMediaWhereInputSchema.optional(),
    orderBy: z
      .union([
        FeedEntryMediaOrderByWithRelationInputSchema.array(),
        FeedEntryMediaOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: FeedEntryMediaWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([FeedEntryMediaScalarFieldEnumSchema, FeedEntryMediaScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaFindManyArgs>

export const FeedEntryMediaAggregateArgsSchema: z.ZodType<Prisma.FeedEntryMediaAggregateArgs> = z
  .object({
    where: FeedEntryMediaWhereInputSchema.optional(),
    orderBy: z
      .union([
        FeedEntryMediaOrderByWithRelationInputSchema.array(),
        FeedEntryMediaOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: FeedEntryMediaWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaAggregateArgs>

export const FeedEntryMediaGroupByArgsSchema: z.ZodType<Prisma.FeedEntryMediaGroupByArgs> = z
  .object({
    where: FeedEntryMediaWhereInputSchema.optional(),
    orderBy: z
      .union([
        FeedEntryMediaOrderByWithAggregationInputSchema.array(),
        FeedEntryMediaOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: FeedEntryMediaScalarFieldEnumSchema.array(),
    having: FeedEntryMediaScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaGroupByArgs>

export const FeedEntryMediaFindUniqueArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindUniqueArgs> = z
  .object({
    select: FeedEntryMediaSelectSchema.optional(),
    include: FeedEntryMediaIncludeSchema.optional(),
    where: FeedEntryMediaWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaFindUniqueArgs>

export const FeedEntryMediaFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindUniqueOrThrowArgs> =
  z
    .object({
      select: FeedEntryMediaSelectSchema.optional(),
      include: FeedEntryMediaIncludeSchema.optional(),
      where: FeedEntryMediaWhereUniqueInputSchema,
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaFindUniqueOrThrowArgs>

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    data: z.union([AccountCreateInputSchema, AccountUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.AccountCreateArgs>

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereUniqueInputSchema,
    create: z.union([AccountCreateInputSchema, AccountUncheckedCreateInputSchema]),
    update: z.union([AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.AccountUpsertArgs>

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z
  .object({
    data: z.union([AccountCreateManyInputSchema, AccountCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.AccountCreateManyArgs>

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([AccountCreateManyInputSchema, AccountCreateManyInputSchema.array()]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.AccountCreateManyAndReturnArgs>

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    where: AccountWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.AccountDeleteArgs>

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z
  .object({
    select: AccountSelectSchema.optional(),
    include: AccountIncludeSchema.optional(),
    data: z.union([AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema]),
    where: AccountWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.AccountUpdateArgs>

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z
  .object({
    data: z.union([AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema]),
    where: AccountWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.AccountUpdateManyArgs>

export const AccountUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema]),
      where: AccountWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.AccountUpdateManyAndReturnArgs>

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z
  .object({
    where: AccountWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.AccountDeleteManyArgs>

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    data: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]).optional(),
  })
  .strict() as z.ZodType<Prisma.UserCreateArgs>

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereUniqueInputSchema,
    create: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
    update: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.UserUpsertArgs>

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z
  .object({
    data: z.union([UserCreateManyInputSchema, UserCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.UserCreateManyArgs>

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z
  .object({
    data: z.union([UserCreateManyInputSchema, UserCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.UserCreateManyAndReturnArgs>

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    where: UserWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.UserDeleteArgs>

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z
  .object({
    select: UserSelectSchema.optional(),
    include: UserIncludeSchema.optional(),
    data: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
    where: UserWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.UserUpdateArgs>

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z
  .object({
    data: z.union([UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema]),
    where: UserWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.UserUpdateManyArgs>

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z
  .object({
    data: z.union([UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema]),
    where: UserWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.UserUpdateManyAndReturnArgs>

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z
  .object({
    where: UserWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.UserDeleteManyArgs>

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    data: z.union([SessionCreateInputSchema, SessionUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.SessionCreateArgs>

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereUniqueInputSchema,
    create: z.union([SessionCreateInputSchema, SessionUncheckedCreateInputSchema]),
    update: z.union([SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.SessionUpsertArgs>

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z
  .object({
    data: z.union([SessionCreateManyInputSchema, SessionCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.SessionCreateManyArgs>

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([SessionCreateManyInputSchema, SessionCreateManyInputSchema.array()]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.SessionCreateManyAndReturnArgs>

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    where: SessionWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.SessionDeleteArgs>

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z
  .object({
    select: SessionSelectSchema.optional(),
    include: SessionIncludeSchema.optional(),
    data: z.union([SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema]),
    where: SessionWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.SessionUpdateArgs>

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z
  .object({
    data: z.union([SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema]),
    where: SessionWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.SessionUpdateManyArgs>

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema]),
      where: SessionWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.SessionUpdateManyAndReturnArgs>

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z
  .object({
    where: SessionWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.SessionDeleteManyArgs>

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> = z
  .object({
    select: VerificationTokenSelectSchema.optional(),
    data: z.union([
      VerificationTokenCreateInputSchema,
      VerificationTokenUncheckedCreateInputSchema,
    ]),
  })
  .strict() as z.ZodType<Prisma.VerificationTokenCreateArgs>

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> = z
  .object({
    select: VerificationTokenSelectSchema.optional(),
    where: VerificationTokenWhereUniqueInputSchema,
    create: z.union([
      VerificationTokenCreateInputSchema,
      VerificationTokenUncheckedCreateInputSchema,
    ]),
    update: z.union([
      VerificationTokenUpdateInputSchema,
      VerificationTokenUncheckedUpdateInputSchema,
    ]),
  })
  .strict() as z.ZodType<Prisma.VerificationTokenUpsertArgs>

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> =
  z
    .object({
      data: z.union([
        VerificationTokenCreateManyInputSchema,
        VerificationTokenCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenCreateManyArgs>

export const VerificationTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        VerificationTokenCreateManyInputSchema,
        VerificationTokenCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenCreateManyAndReturnArgs>

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> = z
  .object({
    select: VerificationTokenSelectSchema.optional(),
    where: VerificationTokenWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.VerificationTokenDeleteArgs>

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> = z
  .object({
    select: VerificationTokenSelectSchema.optional(),
    data: z.union([
      VerificationTokenUpdateInputSchema,
      VerificationTokenUncheckedUpdateInputSchema,
    ]),
    where: VerificationTokenWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.VerificationTokenUpdateArgs>

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> =
  z
    .object({
      data: z.union([
        VerificationTokenUpdateManyMutationInputSchema,
        VerificationTokenUncheckedUpdateManyInputSchema,
      ]),
      where: VerificationTokenWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenUpdateManyArgs>

export const VerificationTokenUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        VerificationTokenUpdateManyMutationInputSchema,
        VerificationTokenUncheckedUpdateManyInputSchema,
      ]),
      where: VerificationTokenWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenUpdateManyAndReturnArgs>

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> =
  z
    .object({
      where: VerificationTokenWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.VerificationTokenDeleteManyArgs>

export const BookmarkCreateArgsSchema: z.ZodType<Prisma.BookmarkCreateArgs> = z
  .object({
    select: BookmarkSelectSchema.optional(),
    include: BookmarkIncludeSchema.optional(),
    data: z.union([BookmarkCreateInputSchema, BookmarkUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.BookmarkCreateArgs>

export const BookmarkUpsertArgsSchema: z.ZodType<Prisma.BookmarkUpsertArgs> = z
  .object({
    select: BookmarkSelectSchema.optional(),
    include: BookmarkIncludeSchema.optional(),
    where: BookmarkWhereUniqueInputSchema,
    create: z.union([BookmarkCreateInputSchema, BookmarkUncheckedCreateInputSchema]),
    update: z.union([BookmarkUpdateInputSchema, BookmarkUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.BookmarkUpsertArgs>

export const BookmarkCreateManyArgsSchema: z.ZodType<Prisma.BookmarkCreateManyArgs> = z
  .object({
    data: z.union([BookmarkCreateManyInputSchema, BookmarkCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkCreateManyArgs>

export const BookmarkCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BookmarkCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([BookmarkCreateManyInputSchema, BookmarkCreateManyInputSchema.array()]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkCreateManyAndReturnArgs>

export const BookmarkDeleteArgsSchema: z.ZodType<Prisma.BookmarkDeleteArgs> = z
  .object({
    select: BookmarkSelectSchema.optional(),
    include: BookmarkIncludeSchema.optional(),
    where: BookmarkWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.BookmarkDeleteArgs>

export const BookmarkUpdateArgsSchema: z.ZodType<Prisma.BookmarkUpdateArgs> = z
  .object({
    select: BookmarkSelectSchema.optional(),
    include: BookmarkIncludeSchema.optional(),
    data: z.union([BookmarkUpdateInputSchema, BookmarkUncheckedUpdateInputSchema]),
    where: BookmarkWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.BookmarkUpdateArgs>

export const BookmarkUpdateManyArgsSchema: z.ZodType<Prisma.BookmarkUpdateManyArgs> = z
  .object({
    data: z.union([BookmarkUpdateManyMutationInputSchema, BookmarkUncheckedUpdateManyInputSchema]),
    where: BookmarkWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkUpdateManyArgs>

export const BookmarkUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BookmarkUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        BookmarkUpdateManyMutationInputSchema,
        BookmarkUncheckedUpdateManyInputSchema,
      ]),
      where: BookmarkWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.BookmarkUpdateManyAndReturnArgs>

export const BookmarkDeleteManyArgsSchema: z.ZodType<Prisma.BookmarkDeleteManyArgs> = z
  .object({
    where: BookmarkWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.BookmarkDeleteManyArgs>

export const TagsOnBookmarksCreateArgsSchema: z.ZodType<Prisma.TagsOnBookmarksCreateArgs> = z
  .object({
    select: TagsOnBookmarksSelectSchema.optional(),
    include: TagsOnBookmarksIncludeSchema.optional(),
    data: z.union([TagsOnBookmarksCreateInputSchema, TagsOnBookmarksUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateArgs>

export const TagsOnBookmarksUpsertArgsSchema: z.ZodType<Prisma.TagsOnBookmarksUpsertArgs> = z
  .object({
    select: TagsOnBookmarksSelectSchema.optional(),
    include: TagsOnBookmarksIncludeSchema.optional(),
    where: TagsOnBookmarksWhereUniqueInputSchema,
    create: z.union([TagsOnBookmarksCreateInputSchema, TagsOnBookmarksUncheckedCreateInputSchema]),
    update: z.union([TagsOnBookmarksUpdateInputSchema, TagsOnBookmarksUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksUpsertArgs>

export const TagsOnBookmarksCreateManyArgsSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyArgs> =
  z
    .object({
      data: z.union([
        TagsOnBookmarksCreateManyInputSchema,
        TagsOnBookmarksCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateManyArgs>

export const TagsOnBookmarksCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        TagsOnBookmarksCreateManyInputSchema,
        TagsOnBookmarksCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksCreateManyAndReturnArgs>

export const TagsOnBookmarksDeleteArgsSchema: z.ZodType<Prisma.TagsOnBookmarksDeleteArgs> = z
  .object({
    select: TagsOnBookmarksSelectSchema.optional(),
    include: TagsOnBookmarksIncludeSchema.optional(),
    where: TagsOnBookmarksWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksDeleteArgs>

export const TagsOnBookmarksUpdateArgsSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateArgs> = z
  .object({
    select: TagsOnBookmarksSelectSchema.optional(),
    include: TagsOnBookmarksIncludeSchema.optional(),
    data: z.union([TagsOnBookmarksUpdateInputSchema, TagsOnBookmarksUncheckedUpdateInputSchema]),
    where: TagsOnBookmarksWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateArgs>

export const TagsOnBookmarksUpdateManyArgsSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyArgs> =
  z
    .object({
      data: z.union([
        TagsOnBookmarksUpdateManyMutationInputSchema,
        TagsOnBookmarksUncheckedUpdateManyInputSchema,
      ]),
      where: TagsOnBookmarksWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateManyArgs>

export const TagsOnBookmarksUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        TagsOnBookmarksUpdateManyMutationInputSchema,
        TagsOnBookmarksUncheckedUpdateManyInputSchema,
      ]),
      where: TagsOnBookmarksWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksUpdateManyAndReturnArgs>

export const TagsOnBookmarksDeleteManyArgsSchema: z.ZodType<Prisma.TagsOnBookmarksDeleteManyArgs> =
  z
    .object({
      where: TagsOnBookmarksWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.TagsOnBookmarksDeleteManyArgs>

export const TagCreateArgsSchema: z.ZodType<Prisma.TagCreateArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    data: z.union([TagCreateInputSchema, TagUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.TagCreateArgs>

export const TagUpsertArgsSchema: z.ZodType<Prisma.TagUpsertArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereUniqueInputSchema,
    create: z.union([TagCreateInputSchema, TagUncheckedCreateInputSchema]),
    update: z.union([TagUpdateInputSchema, TagUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.TagUpsertArgs>

export const TagCreateManyArgsSchema: z.ZodType<Prisma.TagCreateManyArgs> = z
  .object({
    data: z.union([TagCreateManyInputSchema, TagCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.TagCreateManyArgs>

export const TagCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TagCreateManyAndReturnArgs> = z
  .object({
    data: z.union([TagCreateManyInputSchema, TagCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.TagCreateManyAndReturnArgs>

export const TagDeleteArgsSchema: z.ZodType<Prisma.TagDeleteArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    where: TagWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.TagDeleteArgs>

export const TagUpdateArgsSchema: z.ZodType<Prisma.TagUpdateArgs> = z
  .object({
    select: TagSelectSchema.optional(),
    include: TagIncludeSchema.optional(),
    data: z.union([TagUpdateInputSchema, TagUncheckedUpdateInputSchema]),
    where: TagWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.TagUpdateArgs>

export const TagUpdateManyArgsSchema: z.ZodType<Prisma.TagUpdateManyArgs> = z
  .object({
    data: z.union([TagUpdateManyMutationInputSchema, TagUncheckedUpdateManyInputSchema]),
    where: TagWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.TagUpdateManyArgs>

export const TagUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TagUpdateManyAndReturnArgs> = z
  .object({
    data: z.union([TagUpdateManyMutationInputSchema, TagUncheckedUpdateManyInputSchema]),
    where: TagWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.TagUpdateManyAndReturnArgs>

export const TagDeleteManyArgsSchema: z.ZodType<Prisma.TagDeleteManyArgs> = z
  .object({
    where: TagWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.TagDeleteManyArgs>

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z
  .object({
    select: CategorySelectSchema.optional(),
    include: CategoryIncludeSchema.optional(),
    data: z.union([CategoryCreateInputSchema, CategoryUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.CategoryCreateArgs>

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z
  .object({
    select: CategorySelectSchema.optional(),
    include: CategoryIncludeSchema.optional(),
    where: CategoryWhereUniqueInputSchema,
    create: z.union([CategoryCreateInputSchema, CategoryUncheckedCreateInputSchema]),
    update: z.union([CategoryUpdateInputSchema, CategoryUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.CategoryUpsertArgs>

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z
  .object({
    data: z.union([CategoryCreateManyInputSchema, CategoryCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryCreateManyArgs>

export const CategoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([CategoryCreateManyInputSchema, CategoryCreateManyInputSchema.array()]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryCreateManyAndReturnArgs>

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z
  .object({
    select: CategorySelectSchema.optional(),
    include: CategoryIncludeSchema.optional(),
    where: CategoryWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.CategoryDeleteArgs>

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z
  .object({
    select: CategorySelectSchema.optional(),
    include: CategoryIncludeSchema.optional(),
    data: z.union([CategoryUpdateInputSchema, CategoryUncheckedUpdateInputSchema]),
    where: CategoryWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.CategoryUpdateArgs>

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z
  .object({
    data: z.union([CategoryUpdateManyMutationInputSchema, CategoryUncheckedUpdateManyInputSchema]),
    where: CategoryWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryUpdateManyArgs>

export const CategoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        CategoryUpdateManyMutationInputSchema,
        CategoryUncheckedUpdateManyInputSchema,
      ]),
      where: CategoryWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.CategoryUpdateManyAndReturnArgs>

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z
  .object({
    where: CategoryWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.CategoryDeleteManyArgs>

export const FeedCreateArgsSchema: z.ZodType<Prisma.FeedCreateArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    data: z.union([FeedCreateInputSchema, FeedUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.FeedCreateArgs>

export const FeedUpsertArgsSchema: z.ZodType<Prisma.FeedUpsertArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    where: FeedWhereUniqueInputSchema,
    create: z.union([FeedCreateInputSchema, FeedUncheckedCreateInputSchema]),
    update: z.union([FeedUpdateInputSchema, FeedUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.FeedUpsertArgs>

export const FeedCreateManyArgsSchema: z.ZodType<Prisma.FeedCreateManyArgs> = z
  .object({
    data: z.union([FeedCreateManyInputSchema, FeedCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedCreateManyArgs>

export const FeedCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FeedCreateManyAndReturnArgs> = z
  .object({
    data: z.union([FeedCreateManyInputSchema, FeedCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedCreateManyAndReturnArgs>

export const FeedDeleteArgsSchema: z.ZodType<Prisma.FeedDeleteArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    where: FeedWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedDeleteArgs>

export const FeedUpdateArgsSchema: z.ZodType<Prisma.FeedUpdateArgs> = z
  .object({
    select: FeedSelectSchema.optional(),
    include: FeedIncludeSchema.optional(),
    data: z.union([FeedUpdateInputSchema, FeedUncheckedUpdateInputSchema]),
    where: FeedWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedUpdateArgs>

export const FeedUpdateManyArgsSchema: z.ZodType<Prisma.FeedUpdateManyArgs> = z
  .object({
    data: z.union([FeedUpdateManyMutationInputSchema, FeedUncheckedUpdateManyInputSchema]),
    where: FeedWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedUpdateManyArgs>

export const FeedUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.FeedUpdateManyAndReturnArgs> = z
  .object({
    data: z.union([FeedUpdateManyMutationInputSchema, FeedUncheckedUpdateManyInputSchema]),
    where: FeedWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedUpdateManyAndReturnArgs>

export const FeedDeleteManyArgsSchema: z.ZodType<Prisma.FeedDeleteManyArgs> = z
  .object({
    where: FeedWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedDeleteManyArgs>

export const FeedEntryCreateArgsSchema: z.ZodType<Prisma.FeedEntryCreateArgs> = z
  .object({
    select: FeedEntrySelectSchema.optional(),
    include: FeedEntryIncludeSchema.optional(),
    data: z.union([FeedEntryCreateInputSchema, FeedEntryUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.FeedEntryCreateArgs>

export const FeedEntryUpsertArgsSchema: z.ZodType<Prisma.FeedEntryUpsertArgs> = z
  .object({
    select: FeedEntrySelectSchema.optional(),
    include: FeedEntryIncludeSchema.optional(),
    where: FeedEntryWhereUniqueInputSchema,
    create: z.union([FeedEntryCreateInputSchema, FeedEntryUncheckedCreateInputSchema]),
    update: z.union([FeedEntryUpdateInputSchema, FeedEntryUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.FeedEntryUpsertArgs>

export const FeedEntryCreateManyArgsSchema: z.ZodType<Prisma.FeedEntryCreateManyArgs> = z
  .object({
    data: z.union([FeedEntryCreateManyInputSchema, FeedEntryCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryCreateManyArgs>

export const FeedEntryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FeedEntryCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([FeedEntryCreateManyInputSchema, FeedEntryCreateManyInputSchema.array()]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryCreateManyAndReturnArgs>

export const FeedEntryDeleteArgsSchema: z.ZodType<Prisma.FeedEntryDeleteArgs> = z
  .object({
    select: FeedEntrySelectSchema.optional(),
    include: FeedEntryIncludeSchema.optional(),
    where: FeedEntryWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedEntryDeleteArgs>

export const FeedEntryUpdateArgsSchema: z.ZodType<Prisma.FeedEntryUpdateArgs> = z
  .object({
    select: FeedEntrySelectSchema.optional(),
    include: FeedEntryIncludeSchema.optional(),
    data: z.union([FeedEntryUpdateInputSchema, FeedEntryUncheckedUpdateInputSchema]),
    where: FeedEntryWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedEntryUpdateArgs>

export const FeedEntryUpdateManyArgsSchema: z.ZodType<Prisma.FeedEntryUpdateManyArgs> = z
  .object({
    data: z.union([
      FeedEntryUpdateManyMutationInputSchema,
      FeedEntryUncheckedUpdateManyInputSchema,
    ]),
    where: FeedEntryWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryUpdateManyArgs>

export const FeedEntryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.FeedEntryUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        FeedEntryUpdateManyMutationInputSchema,
        FeedEntryUncheckedUpdateManyInputSchema,
      ]),
      where: FeedEntryWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryUpdateManyAndReturnArgs>

export const FeedEntryDeleteManyArgsSchema: z.ZodType<Prisma.FeedEntryDeleteManyArgs> = z
  .object({
    where: FeedEntryWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryDeleteManyArgs>

export const FeedEntryMediaCreateArgsSchema: z.ZodType<Prisma.FeedEntryMediaCreateArgs> = z
  .object({
    select: FeedEntryMediaSelectSchema.optional(),
    include: FeedEntryMediaIncludeSchema.optional(),
    data: z.union([FeedEntryMediaCreateInputSchema, FeedEntryMediaUncheckedCreateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaCreateArgs>

export const FeedEntryMediaUpsertArgsSchema: z.ZodType<Prisma.FeedEntryMediaUpsertArgs> = z
  .object({
    select: FeedEntryMediaSelectSchema.optional(),
    include: FeedEntryMediaIncludeSchema.optional(),
    where: FeedEntryMediaWhereUniqueInputSchema,
    create: z.union([FeedEntryMediaCreateInputSchema, FeedEntryMediaUncheckedCreateInputSchema]),
    update: z.union([FeedEntryMediaUpdateInputSchema, FeedEntryMediaUncheckedUpdateInputSchema]),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaUpsertArgs>

export const FeedEntryMediaCreateManyArgsSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyArgs> = z
  .object({
    data: z.union([
      FeedEntryMediaCreateManyInputSchema,
      FeedEntryMediaCreateManyInputSchema.array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaCreateManyArgs>

export const FeedEntryMediaCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        FeedEntryMediaCreateManyInputSchema,
        FeedEntryMediaCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaCreateManyAndReturnArgs>

export const FeedEntryMediaDeleteArgsSchema: z.ZodType<Prisma.FeedEntryMediaDeleteArgs> = z
  .object({
    select: FeedEntryMediaSelectSchema.optional(),
    include: FeedEntryMediaIncludeSchema.optional(),
    where: FeedEntryMediaWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaDeleteArgs>

export const FeedEntryMediaUpdateArgsSchema: z.ZodType<Prisma.FeedEntryMediaUpdateArgs> = z
  .object({
    select: FeedEntryMediaSelectSchema.optional(),
    include: FeedEntryMediaIncludeSchema.optional(),
    data: z.union([FeedEntryMediaUpdateInputSchema, FeedEntryMediaUncheckedUpdateInputSchema]),
    where: FeedEntryMediaWhereUniqueInputSchema,
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateArgs>

export const FeedEntryMediaUpdateManyArgsSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyArgs> = z
  .object({
    data: z.union([
      FeedEntryMediaUpdateManyMutationInputSchema,
      FeedEntryMediaUncheckedUpdateManyInputSchema,
    ]),
    where: FeedEntryMediaWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateManyArgs>

export const FeedEntryMediaUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        FeedEntryMediaUpdateManyMutationInputSchema,
        FeedEntryMediaUncheckedUpdateManyInputSchema,
      ]),
      where: FeedEntryMediaWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict() as z.ZodType<Prisma.FeedEntryMediaUpdateManyAndReturnArgs>

export const FeedEntryMediaDeleteManyArgsSchema: z.ZodType<Prisma.FeedEntryMediaDeleteManyArgs> = z
  .object({
    where: FeedEntryMediaWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict() as z.ZodType<Prisma.FeedEntryMediaDeleteManyArgs>

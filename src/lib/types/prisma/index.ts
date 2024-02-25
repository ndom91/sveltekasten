import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const BookmarkScalarFieldEnumSchema = z.enum(['id','title','url','image','imageBlur','desc','categoryId','metadata','archived','userId','createdAt','updatedAt']);

export const RelationLoadStrategySchema = z.enum(['query','join']);

export const TagsOnBookmarksScalarFieldEnumSchema = z.enum(['bookmarkId','tagId']);

export const TagScalarFieldEnumSchema = z.enum(['id','name','userId','createdAt','updatedAt']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name','description','userId','createdAt','updatedAt']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','createdAt','updatedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','settings','createdAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const FeedScalarFieldEnumSchema = z.enum(['id','name','url','description','language','copyright','userId','lastFetched','createdAt','updatedAt']);

export const FeedEntryScalarFieldEnumSchema = z.enum(['id','guid','title','link','content','contentSnippet','author','ingested','published','unread','categories','feedId','userId','createdAt','updatedAt']);

export const FeedEntryMediaScalarFieldEnumSchema = z.enum(['id','href','title','medium','height','width','description','credit','feedEntryId','userId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const NullsOrderSchema = z.enum(['first','last']);

export const BookmarkOrderByRelevanceFieldEnumSchema = z.enum(['id','title','url','image','imageBlur','desc','categoryId','userId']);

export const TagsOnBookmarksOrderByRelevanceFieldEnumSchema = z.enum(['bookmarkId','tagId']);

export const TagOrderByRelevanceFieldEnumSchema = z.enum(['id','name','userId']);

export const CategoryOrderByRelevanceFieldEnumSchema = z.enum(['id','name','description','userId']);

export const AccountOrderByRelevanceFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','token_type','scope','id_token','session_state']);

export const SessionOrderByRelevanceFieldEnumSchema = z.enum(['id','sessionToken','userId']);

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['id','name','email','image']);

export const VerificationTokenOrderByRelevanceFieldEnumSchema = z.enum(['identifier','token']);

export const FeedOrderByRelevanceFieldEnumSchema = z.enum(['id','name','url','description','language','copyright','userId']);

export const FeedEntryOrderByRelevanceFieldEnumSchema = z.enum(['id','guid','title','link','content','contentSnippet','author','categories','feedId','userId']);

export const FeedEntryMediaOrderByRelevanceFieldEnumSchema = z.enum(['id','href','title','medium','description','credit','feedEntryId','userId']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

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
  metadata: JsonValueSchema,
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
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  settings: JsonValueSchema,
  createdAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

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
  medium: z.string().nullable(),
  height: z.number().int().nullable(),
  width: z.number().int().nullable(),
  description: z.string().nullable(),
  credit: z.string().nullable(),
  feedEntryId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type FeedEntryMedia = z.infer<typeof FeedEntryMediaSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// BOOKMARK
//------------------------------------------------------

export const BookmarkIncludeSchema: z.ZodType<Prisma.BookmarkInclude> = z.object({
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagsOnBookmarksFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BookmarkCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const BookmarkArgsSchema: z.ZodType<Prisma.BookmarkDefaultArgs> = z.object({
  select: z.lazy(() => BookmarkSelectSchema).optional(),
  include: z.lazy(() => BookmarkIncludeSchema).optional(),
}).strict();

export const BookmarkCountOutputTypeArgsSchema: z.ZodType<Prisma.BookmarkCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => BookmarkCountOutputTypeSelectSchema).nullish(),
}).strict();

export const BookmarkCountOutputTypeSelectSchema: z.ZodType<Prisma.BookmarkCountOutputTypeSelect> = z.object({
  tags: z.boolean().optional(),
}).strict();

export const BookmarkSelectSchema: z.ZodType<Prisma.BookmarkSelect> = z.object({
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
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagsOnBookmarksFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BookmarkCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TAGS ON BOOKMARKS
//------------------------------------------------------

export const TagsOnBookmarksIncludeSchema: z.ZodType<Prisma.TagsOnBookmarksInclude> = z.object({
  bookmark: z.union([z.boolean(),z.lazy(() => BookmarkArgsSchema)]).optional(),
  tag: z.union([z.boolean(),z.lazy(() => TagArgsSchema)]).optional(),
}).strict()

export const TagsOnBookmarksArgsSchema: z.ZodType<Prisma.TagsOnBookmarksDefaultArgs> = z.object({
  select: z.lazy(() => TagsOnBookmarksSelectSchema).optional(),
  include: z.lazy(() => TagsOnBookmarksIncludeSchema).optional(),
}).strict();

export const TagsOnBookmarksSelectSchema: z.ZodType<Prisma.TagsOnBookmarksSelect> = z.object({
  bookmarkId: z.boolean().optional(),
  tagId: z.boolean().optional(),
  bookmark: z.union([z.boolean(),z.lazy(() => BookmarkArgsSchema)]).optional(),
  tag: z.union([z.boolean(),z.lazy(() => TagArgsSchema)]).optional(),
}).strict()

// TAG
//------------------------------------------------------

export const TagIncludeSchema: z.ZodType<Prisma.TagInclude> = z.object({
  bookmarks: z.union([z.boolean(),z.lazy(() => TagsOnBookmarksFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TagArgsSchema: z.ZodType<Prisma.TagDefaultArgs> = z.object({
  select: z.lazy(() => TagSelectSchema).optional(),
  include: z.lazy(() => TagIncludeSchema).optional(),
}).strict();

export const TagCountOutputTypeArgsSchema: z.ZodType<Prisma.TagCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TagCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TagCountOutputTypeSelectSchema: z.ZodType<Prisma.TagCountOutputTypeSelect> = z.object({
  bookmarks: z.boolean().optional(),
}).strict();

export const TagSelectSchema: z.ZodType<Prisma.TagSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  bookmarks: z.union([z.boolean(),z.lazy(() => TagsOnBookmarksFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
  bookmarks: z.union([z.boolean(),z.lazy(() => BookmarkFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  bookmarks: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  bookmarks: z.union([z.boolean(),z.lazy(() => BookmarkFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
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
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  bookmarks: z.union([z.boolean(),z.lazy(() => BookmarkFindManyArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagFindManyArgsSchema)]).optional(),
  feeds: z.union([z.boolean(),z.lazy(() => FeedFindManyArgsSchema)]).optional(),
  feedEntries: z.union([z.boolean(),z.lazy(() => FeedEntryFindManyArgsSchema)]).optional(),
  feedMedia: z.union([z.boolean(),z.lazy(() => FeedEntryMediaFindManyArgsSchema)]).optional(),
  categories: z.union([z.boolean(),z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
  sessions: z.boolean().optional(),
  bookmarks: z.boolean().optional(),
  tags: z.boolean().optional(),
  feeds: z.boolean().optional(),
  feedEntries: z.boolean().optional(),
  feedMedia: z.boolean().optional(),
  categories: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  settings: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  bookmarks: z.union([z.boolean(),z.lazy(() => BookmarkFindManyArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagFindManyArgsSchema)]).optional(),
  feeds: z.union([z.boolean(),z.lazy(() => FeedFindManyArgsSchema)]).optional(),
  feedEntries: z.union([z.boolean(),z.lazy(() => FeedEntryFindManyArgsSchema)]).optional(),
  feedMedia: z.union([z.boolean(),z.lazy(() => FeedEntryMediaFindManyArgsSchema)]).optional(),
  categories: z.union([z.boolean(),z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()

// FEED
//------------------------------------------------------

export const FeedIncludeSchema: z.ZodType<Prisma.FeedInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  feedEntries: z.union([z.boolean(),z.lazy(() => FeedEntryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FeedCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const FeedArgsSchema: z.ZodType<Prisma.FeedDefaultArgs> = z.object({
  select: z.lazy(() => FeedSelectSchema).optional(),
  include: z.lazy(() => FeedIncludeSchema).optional(),
}).strict();

export const FeedCountOutputTypeArgsSchema: z.ZodType<Prisma.FeedCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FeedCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FeedCountOutputTypeSelectSchema: z.ZodType<Prisma.FeedCountOutputTypeSelect> = z.object({
  feedEntries: z.boolean().optional(),
}).strict();

export const FeedSelectSchema: z.ZodType<Prisma.FeedSelect> = z.object({
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
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  feedEntries: z.union([z.boolean(),z.lazy(() => FeedEntryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FeedCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FEED ENTRY
//------------------------------------------------------

export const FeedEntryIncludeSchema: z.ZodType<Prisma.FeedEntryInclude> = z.object({
  feed: z.union([z.boolean(),z.lazy(() => FeedArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  feedMedia: z.union([z.boolean(),z.lazy(() => FeedEntryMediaFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FeedEntryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const FeedEntryArgsSchema: z.ZodType<Prisma.FeedEntryDefaultArgs> = z.object({
  select: z.lazy(() => FeedEntrySelectSchema).optional(),
  include: z.lazy(() => FeedEntryIncludeSchema).optional(),
}).strict();

export const FeedEntryCountOutputTypeArgsSchema: z.ZodType<Prisma.FeedEntryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FeedEntryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FeedEntryCountOutputTypeSelectSchema: z.ZodType<Prisma.FeedEntryCountOutputTypeSelect> = z.object({
  feedMedia: z.boolean().optional(),
}).strict();

export const FeedEntrySelectSchema: z.ZodType<Prisma.FeedEntrySelect> = z.object({
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
  feed: z.union([z.boolean(),z.lazy(() => FeedArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  feedMedia: z.union([z.boolean(),z.lazy(() => FeedEntryMediaFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FeedEntryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FEED ENTRY MEDIA
//------------------------------------------------------

export const FeedEntryMediaIncludeSchema: z.ZodType<Prisma.FeedEntryMediaInclude> = z.object({
  feedEntry: z.union([z.boolean(),z.lazy(() => FeedEntryArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const FeedEntryMediaArgsSchema: z.ZodType<Prisma.FeedEntryMediaDefaultArgs> = z.object({
  select: z.lazy(() => FeedEntryMediaSelectSchema).optional(),
  include: z.lazy(() => FeedEntryMediaIncludeSchema).optional(),
}).strict();

export const FeedEntryMediaSelectSchema: z.ZodType<Prisma.FeedEntryMediaSelect> = z.object({
  id: z.boolean().optional(),
  href: z.boolean().optional(),
  title: z.boolean().optional(),
  medium: z.boolean().optional(),
  height: z.boolean().optional(),
  width: z.boolean().optional(),
  description: z.boolean().optional(),
  credit: z.boolean().optional(),
  feedEntryId: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  feedEntry: z.union([z.boolean(),z.lazy(() => FeedEntryArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const BookmarkWhereInputSchema: z.ZodType<Prisma.BookmarkWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BookmarkWhereInputSchema),z.lazy(() => BookmarkWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookmarkWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookmarkWhereInputSchema),z.lazy(() => BookmarkWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  imageBlur: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  desc: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  categoryId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  archived: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  category: z.union([ z.lazy(() => CategoryNullableRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagsOnBookmarksListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const BookmarkOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.BookmarkOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageBlur: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  desc: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  categoryId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  archived: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  tags: z.lazy(() => TagsOnBookmarksOrderByRelationAggregateInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  _relevance: z.lazy(() => BookmarkOrderByRelevanceInputSchema).optional()
}).strict();

export const BookmarkWhereUniqueInputSchema: z.ZodType<Prisma.BookmarkWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    url_userId: z.lazy(() => BookmarkUrlUserIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    url_userId: z.lazy(() => BookmarkUrlUserIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  url_userId: z.lazy(() => BookmarkUrlUserIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => BookmarkWhereInputSchema),z.lazy(() => BookmarkWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookmarkWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookmarkWhereInputSchema),z.lazy(() => BookmarkWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  imageBlur: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  desc: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  categoryId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  archived: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  category: z.union([ z.lazy(() => CategoryNullableRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagsOnBookmarksListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const BookmarkOrderByWithAggregationInputSchema: z.ZodType<Prisma.BookmarkOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageBlur: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  desc: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  categoryId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  archived: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BookmarkCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BookmarkMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BookmarkMinOrderByAggregateInputSchema).optional()
}).strict();

export const BookmarkScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BookmarkScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema),z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema),z.lazy(() => BookmarkScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  imageBlur: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  desc: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  categoryId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  archived: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TagsOnBookmarksWhereInputSchema: z.ZodType<Prisma.TagsOnBookmarksWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagsOnBookmarksWhereInputSchema),z.lazy(() => TagsOnBookmarksWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagsOnBookmarksWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagsOnBookmarksWhereInputSchema),z.lazy(() => TagsOnBookmarksWhereInputSchema).array() ]).optional(),
  bookmarkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tagId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  bookmark: z.union([ z.lazy(() => BookmarkRelationFilterSchema),z.lazy(() => BookmarkWhereInputSchema) ]).optional(),
  tag: z.union([ z.lazy(() => TagRelationFilterSchema),z.lazy(() => TagWhereInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInput> = z.object({
  bookmarkId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional(),
  bookmark: z.lazy(() => BookmarkOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  tag: z.lazy(() => TagOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  _relevance: z.lazy(() => TagsOnBookmarksOrderByRelevanceInputSchema).optional()
}).strict();

export const TagsOnBookmarksWhereUniqueInputSchema: z.ZodType<Prisma.TagsOnBookmarksWhereUniqueInput> = z.object({
  bookmarkId_tagId: z.lazy(() => TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInputSchema)
})
.and(z.object({
  bookmarkId_tagId: z.lazy(() => TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => TagsOnBookmarksWhereInputSchema),z.lazy(() => TagsOnBookmarksWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagsOnBookmarksWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagsOnBookmarksWhereInputSchema),z.lazy(() => TagsOnBookmarksWhereInputSchema).array() ]).optional(),
  bookmarkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tagId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  bookmark: z.union([ z.lazy(() => BookmarkRelationFilterSchema),z.lazy(() => BookmarkWhereInputSchema) ]).optional(),
  tag: z.union([ z.lazy(() => TagRelationFilterSchema),z.lazy(() => TagWhereInputSchema) ]).optional(),
}).strict());

export const TagsOnBookmarksOrderByWithAggregationInputSchema: z.ZodType<Prisma.TagsOnBookmarksOrderByWithAggregationInput> = z.object({
  bookmarkId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TagsOnBookmarksCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TagsOnBookmarksMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TagsOnBookmarksMinOrderByAggregateInputSchema).optional()
}).strict();

export const TagsOnBookmarksScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TagsOnBookmarksScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema),z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema),z.lazy(() => TagsOnBookmarksScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  bookmarkId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tagId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const TagWhereInputSchema: z.ZodType<Prisma.TagWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const TagOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.TagOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksOrderByRelationAggregateInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  _relevance: z.lazy(() => TagOrderByRelevanceInputSchema).optional()
}).strict();

export const TagWhereUniqueInputSchema: z.ZodType<Prisma.TagWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name_userId: z.lazy(() => TagNameUserIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name_userId: z.lazy(() => TagNameUserIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name_userId: z.lazy(() => TagNameUserIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const TagOrderByWithAggregationInputSchema: z.ZodType<Prisma.TagOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TagCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TagMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TagMinOrderByAggregateInputSchema).optional()
}).strict();

export const TagScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TagScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TagScalarWhereWithAggregatesInputSchema),z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagScalarWhereWithAggregatesInputSchema),z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  bookmarks: z.lazy(() => BookmarkListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const CategoryOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  bookmarks: z.lazy(() => BookmarkOrderByRelationAggregateInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  _relevance: z.lazy(() => CategoryOrderByRelevanceInputSchema).optional()
}).strict();

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name_userId: z.lazy(() => CategoryNameUserIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name_userId: z.lazy(() => CategoryNameUserIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name_userId: z.lazy(() => CategoryNameUserIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  bookmarks: z.lazy(() => BookmarkListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional()
}).strict();

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  _relevance: z.lazy(() => AccountOrderByRelevanceInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  _relevance: z.lazy(() => SessionOrderByRelevanceInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    sessionToken: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    sessionToken: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  settings: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  bookmarks: z.lazy(() => BookmarkListRelationFilterSchema).optional(),
  tags: z.lazy(() => TagListRelationFilterSchema).optional(),
  feeds: z.lazy(() => FeedListRelationFilterSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryListRelationFilterSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaListRelationFilterSchema).optional(),
  categories: z.lazy(() => CategoryListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.UserOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  settings: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkOrderByRelationAggregateInputSchema).optional(),
  tags: z.lazy(() => TagOrderByRelationAggregateInputSchema).optional(),
  feeds: z.lazy(() => FeedOrderByRelationAggregateInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryOrderByRelationAggregateInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaOrderByRelationAggregateInputSchema).optional(),
  categories: z.lazy(() => CategoryOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => UserOrderByRelevanceInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  settings: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  bookmarks: z.lazy(() => BookmarkListRelationFilterSchema).optional(),
  tags: z.lazy(() => TagListRelationFilterSchema).optional(),
  feeds: z.lazy(() => FeedListRelationFilterSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryListRelationFilterSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaListRelationFilterSchema).optional(),
  categories: z.lazy(() => CategoryListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  settings: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  settings: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationAndSearchRelevanceInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _relevance: z.lazy(() => VerificationTokenOrderByRelevanceInputSchema).optional()
}).strict();

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> = z.union([
  z.object({
    token: z.string(),
    identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema)
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  token: z.string().optional(),
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FeedWhereInputSchema: z.ZodType<Prisma.FeedWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FeedWhereInputSchema),z.lazy(() => FeedWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedWhereInputSchema),z.lazy(() => FeedWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  language: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  copyright: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastFetched: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  feedEntries: z.lazy(() => FeedEntryListRelationFilterSchema).optional()
}).strict();

export const FeedOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.FeedOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  copyright: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  lastFetched: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => FeedOrderByRelevanceInputSchema).optional()
}).strict();

export const FeedWhereUniqueInputSchema: z.ZodType<Prisma.FeedWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    url_userId: z.lazy(() => FeedUrlUserIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    url_userId: z.lazy(() => FeedUrlUserIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  url_userId: z.lazy(() => FeedUrlUserIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => FeedWhereInputSchema),z.lazy(() => FeedWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedWhereInputSchema),z.lazy(() => FeedWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  language: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  copyright: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastFetched: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  feedEntries: z.lazy(() => FeedEntryListRelationFilterSchema).optional()
}).strict());

export const FeedOrderByWithAggregationInputSchema: z.ZodType<Prisma.FeedOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  copyright: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  lastFetched: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FeedCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FeedMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FeedMinOrderByAggregateInputSchema).optional()
}).strict();

export const FeedScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FeedScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FeedScalarWhereWithAggregatesInputSchema),z.lazy(() => FeedScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedScalarWhereWithAggregatesInputSchema),z.lazy(() => FeedScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  language: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  copyright: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastFetched: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FeedEntryWhereInputSchema: z.ZodType<Prisma.FeedEntryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FeedEntryWhereInputSchema),z.lazy(() => FeedEntryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedEntryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedEntryWhereInputSchema),z.lazy(() => FeedEntryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  guid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contentSnippet: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  author: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ingested: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  published: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  unread: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  categories: z.lazy(() => StringNullableListFilterSchema).optional(),
  feedId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  feed: z.union([ z.lazy(() => FeedRelationFilterSchema),z.lazy(() => FeedWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaListRelationFilterSchema).optional()
}).strict();

export const FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.FeedEntryOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  guid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  content: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  contentSnippet: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  author: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ingested: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  published: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  unread: z.lazy(() => SortOrderSchema).optional(),
  categories: z.lazy(() => SortOrderSchema).optional(),
  feedId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  feed: z.lazy(() => FeedOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => FeedEntryOrderByRelevanceInputSchema).optional()
}).strict();

export const FeedEntryWhereUniqueInputSchema: z.ZodType<Prisma.FeedEntryWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => FeedEntryWhereInputSchema),z.lazy(() => FeedEntryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedEntryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedEntryWhereInputSchema),z.lazy(() => FeedEntryWhereInputSchema).array() ]).optional(),
  guid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contentSnippet: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  author: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ingested: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  published: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  unread: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  categories: z.lazy(() => StringNullableListFilterSchema).optional(),
  feedId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  feed: z.union([ z.lazy(() => FeedRelationFilterSchema),z.lazy(() => FeedWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaListRelationFilterSchema).optional()
}).strict());

export const FeedEntryOrderByWithAggregationInputSchema: z.ZodType<Prisma.FeedEntryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  guid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  content: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  contentSnippet: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  author: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ingested: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  published: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  unread: z.lazy(() => SortOrderSchema).optional(),
  categories: z.lazy(() => SortOrderSchema).optional(),
  feedId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FeedEntryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FeedEntryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FeedEntryMinOrderByAggregateInputSchema).optional()
}).strict();

export const FeedEntryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FeedEntryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema),z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema),z.lazy(() => FeedEntryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  guid: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  contentSnippet: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  author: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  ingested: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  published: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  unread: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  categories: z.lazy(() => StringNullableListFilterSchema).optional(),
  feedId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FeedEntryMediaWhereInputSchema: z.ZodType<Prisma.FeedEntryMediaWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FeedEntryMediaWhereInputSchema),z.lazy(() => FeedEntryMediaWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedEntryMediaWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedEntryMediaWhereInputSchema),z.lazy(() => FeedEntryMediaWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  href: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  medium: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  height: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  width: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  credit: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  feedEntryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  feedEntry: z.union([ z.lazy(() => FeedEntryRelationFilterSchema),z.lazy(() => FeedEntryWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema: z.ZodType<Prisma.FeedEntryMediaOrderByWithRelationAndSearchRelevanceInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  href: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  medium: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  height: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  width: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  credit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  feedEntryId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  feedEntry: z.lazy(() => FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputSchema).optional(),
  _relevance: z.lazy(() => FeedEntryMediaOrderByRelevanceInputSchema).optional()
}).strict();

export const FeedEntryMediaWhereUniqueInputSchema: z.ZodType<Prisma.FeedEntryMediaWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => FeedEntryMediaWhereInputSchema),z.lazy(() => FeedEntryMediaWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedEntryMediaWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedEntryMediaWhereInputSchema),z.lazy(() => FeedEntryMediaWhereInputSchema).array() ]).optional(),
  href: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  medium: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  height: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  width: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  credit: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  feedEntryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  feedEntry: z.union([ z.lazy(() => FeedEntryRelationFilterSchema),z.lazy(() => FeedEntryWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const FeedEntryMediaOrderByWithAggregationInputSchema: z.ZodType<Prisma.FeedEntryMediaOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  href: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  medium: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  height: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  width: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  credit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  feedEntryId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FeedEntryMediaCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FeedEntryMediaAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FeedEntryMediaMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FeedEntryMediaMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FeedEntryMediaSumOrderByAggregateInputSchema).optional()
}).strict();

export const FeedEntryMediaScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FeedEntryMediaScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema),z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema),z.lazy(() => FeedEntryMediaScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  href: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  medium: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  height: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  width: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  credit: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  feedEntryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const BookmarkCreateInputSchema: z.ZodType<Prisma.BookmarkCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutBookmarksInputSchema).optional(),
  tags: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutBookmarkInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutBookmarksInputSchema).optional()
}).strict();

export const BookmarkUncheckedCreateInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInputSchema).optional()
}).strict();

export const BookmarkUpdateInputSchema: z.ZodType<Prisma.BookmarkUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.lazy(() => CategoryUpdateOneWithoutBookmarksNestedInputSchema).optional(),
  tags: z.lazy(() => TagsOnBookmarksUpdateManyWithoutBookmarkNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutBookmarksNestedInputSchema).optional()
}).strict();

export const BookmarkUncheckedUpdateInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categoryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInputSchema).optional()
}).strict();

export const BookmarkCreateManyInputSchema: z.ZodType<Prisma.BookmarkCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BookmarkUpdateManyMutationInputSchema: z.ZodType<Prisma.BookmarkUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookmarkUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categoryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksCreateInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateInput> = z.object({
  bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutTagsInputSchema),
  tag: z.lazy(() => TagCreateNestedOneWithoutBookmarksInputSchema)
}).strict();

export const TagsOnBookmarksUncheckedCreateInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateInput> = z.object({
  bookmarkId: z.string(),
  tagId: z.string()
}).strict();

export const TagsOnBookmarksUpdateInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateInput> = z.object({
  bookmark: z.lazy(() => BookmarkUpdateOneRequiredWithoutTagsNestedInputSchema).optional(),
  tag: z.lazy(() => TagUpdateOneRequiredWithoutBookmarksNestedInputSchema).optional()
}).strict();

export const TagsOnBookmarksUncheckedUpdateInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateInput> = z.object({
  bookmarkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tagId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksCreateManyInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyInput> = z.object({
  bookmarkId: z.string(),
  tagId: z.string()
}).strict();

export const TagsOnBookmarksUpdateManyMutationInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyMutationInput> = z.object({
}).strict();

export const TagsOnBookmarksUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyInput> = z.object({
  bookmarkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tagId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagCreateInputSchema: z.ZodType<Prisma.TagCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutTagInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutTagsInputSchema).optional()
}).strict();

export const TagUncheckedCreateInputSchema: z.ZodType<Prisma.TagUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInputSchema).optional()
}).strict();

export const TagUpdateInputSchema: z.ZodType<Prisma.TagUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksUpdateManyWithoutTagNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateInputSchema: z.ZodType<Prisma.TagUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInputSchema).optional()
}).strict();

export const TagCreateManyInputSchema: z.ZodType<Prisma.TagCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TagUpdateManyMutationInputSchema: z.ZodType<Prisma.TagUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutCategoryInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCategoriesInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutCategoryNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutCategoriesNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
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
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
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
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
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
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedCreateInputSchema: z.ZodType<Prisma.FeedCreateInput> = z.object({
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
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutFeedInputSchema).optional()
}).strict();

export const FeedUncheckedCreateInputSchema: z.ZodType<Prisma.FeedUncheckedCreateInput> = z.object({
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
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutFeedInputSchema).optional()
}).strict();

export const FeedUpdateInputSchema: z.ZodType<Prisma.FeedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFeedsNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutFeedNestedInputSchema).optional()
}).strict();

export const FeedUncheckedUpdateInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutFeedNestedInputSchema).optional()
}).strict();

export const FeedCreateManyInputSchema: z.ZodType<Prisma.FeedCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  url: z.string(),
  description: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  copyright: z.string().optional().nullable(),
  userId: z.string(),
  lastFetched: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedUpdateManyMutationInputSchema: z.ZodType<Prisma.FeedUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryCreateInputSchema: z.ZodType<Prisma.FeedEntryCreateInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feed: z.lazy(() => FeedCreateNestedOneWithoutFeedEntriesInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutFeedEntriesInputSchema),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutFeedEntryInputSchema).optional()
}).strict();

export const FeedEntryUncheckedCreateInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInputSchema).optional()
}).strict();

export const FeedEntryUpdateInputSchema: z.ZodType<Prisma.FeedEntryUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feed: z.lazy(() => FeedUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutFeedEntryNestedInputSchema).optional()
}).strict();

export const FeedEntryUncheckedUpdateInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInputSchema).optional()
}).strict();

export const FeedEntryCreateManyInputSchema: z.ZodType<Prisma.FeedEntryCreateManyInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryUpdateManyMutationInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaCreateInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feedEntry: z.lazy(() => FeedEntryCreateNestedOneWithoutFeedMediaInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutFeedMediaInputSchema)
}).strict();

export const FeedEntryMediaUncheckedCreateInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  feedEntryId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryMediaUpdateInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feedEntry: z.lazy(() => FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFeedMediaNestedInputSchema).optional()
}).strict();

export const FeedEntryMediaUncheckedUpdateInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  feedEntryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaCreateManyInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  feedEntryId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryMediaUpdateManyMutationInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  feedEntryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const CategoryNullableRelationFilterSchema: z.ZodType<Prisma.CategoryNullableRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional().nullable()
}).strict();

export const TagsOnBookmarksListRelationFilterSchema: z.ZodType<Prisma.TagsOnBookmarksListRelationFilter> = z.object({
  every: z.lazy(() => TagsOnBookmarksWhereInputSchema).optional(),
  some: z.lazy(() => TagsOnBookmarksWhereInputSchema).optional(),
  none: z.lazy(() => TagsOnBookmarksWhereInputSchema).optional()
}).strict();

export const UserNullableRelationFilterSchema: z.ZodType<Prisma.UserNullableRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const TagsOnBookmarksOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TagsOnBookmarksOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BookmarkOrderByRelevanceInputSchema: z.ZodType<Prisma.BookmarkOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => BookmarkOrderByRelevanceFieldEnumSchema),z.lazy(() => BookmarkOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const BookmarkUrlUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.BookmarkUrlUserIdCompoundUniqueInput> = z.object({
  url: z.string(),
  userId: z.string()
}).strict();

export const BookmarkCountOrderByAggregateInputSchema: z.ZodType<Prisma.BookmarkCountOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BookmarkMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BookmarkMaxOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BookmarkMinOrderByAggregateInputSchema: z.ZodType<Prisma.BookmarkMinOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const BookmarkRelationFilterSchema: z.ZodType<Prisma.BookmarkRelationFilter> = z.object({
  is: z.lazy(() => BookmarkWhereInputSchema).optional(),
  isNot: z.lazy(() => BookmarkWhereInputSchema).optional()
}).strict();

export const TagRelationFilterSchema: z.ZodType<Prisma.TagRelationFilter> = z.object({
  is: z.lazy(() => TagWhereInputSchema).optional(),
  isNot: z.lazy(() => TagWhereInputSchema).optional()
}).strict();

export const TagsOnBookmarksOrderByRelevanceInputSchema: z.ZodType<Prisma.TagsOnBookmarksOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => TagsOnBookmarksOrderByRelevanceFieldEnumSchema),z.lazy(() => TagsOnBookmarksOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInputSchema: z.ZodType<Prisma.TagsOnBookmarksBookmarkIdTagIdCompoundUniqueInput> = z.object({
  bookmarkId: z.string(),
  tagId: z.string()
}).strict();

export const TagsOnBookmarksCountOrderByAggregateInputSchema: z.ZodType<Prisma.TagsOnBookmarksCountOrderByAggregateInput> = z.object({
  bookmarkId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagsOnBookmarksMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TagsOnBookmarksMaxOrderByAggregateInput> = z.object({
  bookmarkId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagsOnBookmarksMinOrderByAggregateInputSchema: z.ZodType<Prisma.TagsOnBookmarksMinOrderByAggregateInput> = z.object({
  bookmarkId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagOrderByRelevanceInputSchema: z.ZodType<Prisma.TagOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => TagOrderByRelevanceFieldEnumSchema),z.lazy(() => TagOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const TagNameUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.TagNameUserIdCompoundUniqueInput> = z.object({
  name: z.string(),
  userId: z.string()
}).strict();

export const TagCountOrderByAggregateInputSchema: z.ZodType<Prisma.TagCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TagMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagMinOrderByAggregateInputSchema: z.ZodType<Prisma.TagMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BookmarkListRelationFilterSchema: z.ZodType<Prisma.BookmarkListRelationFilter> = z.object({
  every: z.lazy(() => BookmarkWhereInputSchema).optional(),
  some: z.lazy(() => BookmarkWhereInputSchema).optional(),
  none: z.lazy(() => BookmarkWhereInputSchema).optional()
}).strict();

export const BookmarkOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BookmarkOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryOrderByRelevanceInputSchema: z.ZodType<Prisma.CategoryOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => CategoryOrderByRelevanceFieldEnumSchema),z.lazy(() => CategoryOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const CategoryNameUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.CategoryNameUserIdCompoundUniqueInput> = z.object({
  name: z.string(),
  userId: z.string()
}).strict();

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const AccountOrderByRelevanceInputSchema: z.ZodType<Prisma.AccountOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => AccountOrderByRelevanceFieldEnumSchema),z.lazy(() => AccountOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.object({
  provider: z.string(),
  providerAccountId: z.string()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const SessionOrderByRelevanceInputSchema: z.ZodType<Prisma.SessionOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => SessionOrderByRelevanceFieldEnumSchema),z.lazy(() => SessionOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const TagListRelationFilterSchema: z.ZodType<Prisma.TagListRelationFilter> = z.object({
  every: z.lazy(() => TagWhereInputSchema).optional(),
  some: z.lazy(() => TagWhereInputSchema).optional(),
  none: z.lazy(() => TagWhereInputSchema).optional()
}).strict();

export const FeedListRelationFilterSchema: z.ZodType<Prisma.FeedListRelationFilter> = z.object({
  every: z.lazy(() => FeedWhereInputSchema).optional(),
  some: z.lazy(() => FeedWhereInputSchema).optional(),
  none: z.lazy(() => FeedWhereInputSchema).optional()
}).strict();

export const FeedEntryListRelationFilterSchema: z.ZodType<Prisma.FeedEntryListRelationFilter> = z.object({
  every: z.lazy(() => FeedEntryWhereInputSchema).optional(),
  some: z.lazy(() => FeedEntryWhereInputSchema).optional(),
  none: z.lazy(() => FeedEntryWhereInputSchema).optional()
}).strict();

export const FeedEntryMediaListRelationFilterSchema: z.ZodType<Prisma.FeedEntryMediaListRelationFilter> = z.object({
  every: z.lazy(() => FeedEntryMediaWhereInputSchema).optional(),
  some: z.lazy(() => FeedEntryMediaWhereInputSchema).optional(),
  none: z.lazy(() => FeedEntryMediaWhereInputSchema).optional()
}).strict();

export const CategoryListRelationFilterSchema: z.ZodType<Prisma.CategoryListRelationFilter> = z.object({
  every: z.lazy(() => CategoryWhereInputSchema).optional(),
  some: z.lazy(() => CategoryWhereInputSchema).optional(),
  none: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TagOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FeedOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FeedEntryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryMediaOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CategoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOrderByRelevanceInputSchema: z.ZodType<Prisma.UserOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => UserOrderByRelevanceFieldEnumSchema),z.lazy(() => UserOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  settings: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const VerificationTokenOrderByRelevanceInputSchema: z.ZodType<Prisma.VerificationTokenOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => VerificationTokenOrderByRelevanceFieldEnumSchema),z.lazy(() => VerificationTokenOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> = z.object({
  identifier: z.string(),
  token: z.string()
}).strict();

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedOrderByRelevanceInputSchema: z.ZodType<Prisma.FeedOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => FeedOrderByRelevanceFieldEnumSchema),z.lazy(() => FeedOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const FeedUrlUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.FeedUrlUserIdCompoundUniqueInput> = z.object({
  url: z.string(),
  userId: z.string()
}).strict();

export const FeedCountOrderByAggregateInputSchema: z.ZodType<Prisma.FeedCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  copyright: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  lastFetched: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FeedMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  copyright: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  lastFetched: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedMinOrderByAggregateInputSchema: z.ZodType<Prisma.FeedMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  copyright: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  lastFetched: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const FeedRelationFilterSchema: z.ZodType<Prisma.FeedRelationFilter> = z.object({
  is: z.lazy(() => FeedWhereInputSchema).optional(),
  isNot: z.lazy(() => FeedWhereInputSchema).optional()
}).strict();

export const FeedEntryOrderByRelevanceInputSchema: z.ZodType<Prisma.FeedEntryOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => FeedEntryOrderByRelevanceFieldEnumSchema),z.lazy(() => FeedEntryOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const FeedEntryCountOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryCountOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMaxOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryMinOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMinOrderByAggregateInput> = z.object({
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
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryRelationFilterSchema: z.ZodType<Prisma.FeedEntryRelationFilter> = z.object({
  is: z.lazy(() => FeedEntryWhereInputSchema).optional(),
  isNot: z.lazy(() => FeedEntryWhereInputSchema).optional()
}).strict();

export const FeedEntryMediaOrderByRelevanceInputSchema: z.ZodType<Prisma.FeedEntryMediaOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => FeedEntryMediaOrderByRelevanceFieldEnumSchema),z.lazy(() => FeedEntryMediaOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const FeedEntryMediaCountOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  href: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  medium: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  credit: z.lazy(() => SortOrderSchema).optional(),
  feedEntryId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryMediaAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaAvgOrderByAggregateInput> = z.object({
  height: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryMediaMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  href: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  medium: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  credit: z.lazy(() => SortOrderSchema).optional(),
  feedEntryId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryMediaMinOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  href: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  medium: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  credit: z.lazy(() => SortOrderSchema).optional(),
  feedEntryId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FeedEntryMediaSumOrderByAggregateInputSchema: z.ZodType<Prisma.FeedEntryMediaSumOrderByAggregateInput> = z.object({
  height: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryCreateNestedOneWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutBookmarksInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutBookmarksInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutBookmarksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutBookmarksInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional()
}).strict();

export const TagsOnBookmarksCreateNestedManyWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateNestedManyWithoutBookmarkInput> = z.object({
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema).array(),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutBookmarksInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutBookmarksInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutBookmarksInputSchema),z.lazy(() => UserUncheckedCreateWithoutBookmarksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBookmarksInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInput> = z.object({
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema).array(),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const CategoryUpdateOneWithoutBookmarksNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneWithoutBookmarksNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutBookmarksInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutBookmarksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutBookmarksInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutBookmarksInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutBookmarksInputSchema),z.lazy(() => CategoryUpdateWithoutBookmarksInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutBookmarksInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksUpdateManyWithoutBookmarkNestedInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithoutBookmarkNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema).array(),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutBookmarksNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutBookmarksNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutBookmarksInputSchema),z.lazy(() => UserUncheckedCreateWithoutBookmarksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBookmarksInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutBookmarksInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutBookmarksInputSchema),z.lazy(() => UserUpdateWithoutBookmarksInputSchema),z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema).array(),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookmarkCreateNestedOneWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkCreateNestedOneWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutTagsInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookmarkCreateOrConnectWithoutTagsInputSchema).optional(),
  connect: z.lazy(() => BookmarkWhereUniqueInputSchema).optional()
}).strict();

export const TagCreateNestedOneWithoutBookmarksInputSchema: z.ZodType<Prisma.TagCreateNestedOneWithoutBookmarksInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutBookmarksInputSchema),z.lazy(() => TagUncheckedCreateWithoutBookmarksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutBookmarksInputSchema).optional(),
  connect: z.lazy(() => TagWhereUniqueInputSchema).optional()
}).strict();

export const BookmarkUpdateOneRequiredWithoutTagsNestedInputSchema: z.ZodType<Prisma.BookmarkUpdateOneRequiredWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutTagsInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookmarkCreateOrConnectWithoutTagsInputSchema).optional(),
  upsert: z.lazy(() => BookmarkUpsertWithoutTagsInputSchema).optional(),
  connect: z.lazy(() => BookmarkWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BookmarkUpdateToOneWithWhereWithoutTagsInputSchema),z.lazy(() => BookmarkUpdateWithoutTagsInputSchema),z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputSchema) ]).optional(),
}).strict();

export const TagUpdateOneRequiredWithoutBookmarksNestedInputSchema: z.ZodType<Prisma.TagUpdateOneRequiredWithoutBookmarksNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutBookmarksInputSchema),z.lazy(() => TagUncheckedCreateWithoutBookmarksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutBookmarksInputSchema).optional(),
  upsert: z.lazy(() => TagUpsertWithoutBookmarksInputSchema).optional(),
  connect: z.lazy(() => TagWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TagUpdateToOneWithWhereWithoutBookmarksInputSchema),z.lazy(() => TagUpdateWithoutBookmarksInputSchema),z.lazy(() => TagUncheckedUpdateWithoutBookmarksInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksCreateNestedManyWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateNestedManyWithoutTagInput> = z.object({
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema).array(),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagsOnBookmarksCreateManyTagInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInput> = z.object({
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema).array(),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagsOnBookmarksCreateManyTagInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TagsOnBookmarksUpdateManyWithoutTagNestedInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithoutTagNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema).array(),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagsOnBookmarksCreateManyTagInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutTagsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTagsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTagsInputSchema),z.lazy(() => UserUpdateWithoutTagsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTagsInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema).array(),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksCreateOrConnectWithoutTagInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagsOnBookmarksCreateManyTagInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookmarkCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkCreateWithoutCategoryInputSchema).array(),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookmarkCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutCategoriesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCategoriesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCategoriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutCategoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCategoriesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const BookmarkUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkCreateWithoutCategoryInputSchema).array(),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookmarkCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BookmarkUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.BookmarkUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkCreateWithoutCategoryInputSchema).array(),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookmarkCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BookmarkUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => BookmarkUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BookmarkScalarWhereInputSchema),z.lazy(() => BookmarkScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutCategoriesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutCategoriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCategoriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutCategoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCategoriesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCategoriesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCategoriesInputSchema),z.lazy(() => UserUpdateWithoutCategoriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCategoriesInputSchema) ]).optional(),
}).strict();

export const BookmarkUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkCreateWithoutCategoryInputSchema).array(),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => BookmarkCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookmarkCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BookmarkUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => BookmarkUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BookmarkScalarWhereInputSchema),z.lazy(() => BookmarkScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BookmarkCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BookmarkCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutUserInputSchema),z.lazy(() => BookmarkCreateWithoutUserInputSchema).array(),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema),z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TagCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TagCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutUserInputSchema),z.lazy(() => TagCreateWithoutUserInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutUserInputSchema),z.lazy(() => TagCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FeedCreateWithoutUserInputSchema),z.lazy(() => FeedCreateWithoutUserInputSchema).array(),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutUserInputSchema),z.lazy(() => FeedEntryCreateWithoutUserInputSchema).array(),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryMediaCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema).array(),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryMediaCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CategoryCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutUserInputSchema),z.lazy(() => CategoryCreateWithoutUserInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BookmarkUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutUserInputSchema),z.lazy(() => BookmarkCreateWithoutUserInputSchema).array(),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema),z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TagUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TagUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutUserInputSchema),z.lazy(() => TagCreateWithoutUserInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutUserInputSchema),z.lazy(() => TagCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FeedCreateWithoutUserInputSchema),z.lazy(() => FeedCreateWithoutUserInputSchema).array(),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutUserInputSchema),z.lazy(() => FeedEntryCreateWithoutUserInputSchema).array(),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema).array(),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryMediaCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutUserInputSchema),z.lazy(() => CategoryCreateWithoutUserInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookmarkUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BookmarkUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutUserInputSchema),z.lazy(() => BookmarkCreateWithoutUserInputSchema).array(),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema),z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BookmarkScalarWhereInputSchema),z.lazy(() => BookmarkScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TagUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TagUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutUserInputSchema),z.lazy(() => TagCreateWithoutUserInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutUserInputSchema),z.lazy(() => TagCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TagUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedCreateWithoutUserInputSchema),z.lazy(() => FeedCreateWithoutUserInputSchema).array(),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FeedUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedScalarWhereInputSchema),z.lazy(() => FeedScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutUserInputSchema),z.lazy(() => FeedEntryCreateWithoutUserInputSchema).array(),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedEntryUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FeedEntryUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedEntryScalarWhereInputSchema),z.lazy(() => FeedEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryMediaUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema).array(),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryMediaCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedEntryMediaScalarWhereInputSchema),z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutUserInputSchema),z.lazy(() => CategoryCreateWithoutUserInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CategoryUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CategoryUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => CategoryUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookmarkCreateWithoutUserInputSchema),z.lazy(() => BookmarkCreateWithoutUserInputSchema).array(),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema),z.lazy(() => BookmarkCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BookmarkWhereUniqueInputSchema),z.lazy(() => BookmarkWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BookmarkScalarWhereInputSchema),z.lazy(() => BookmarkScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TagUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutUserInputSchema),z.lazy(() => TagCreateWithoutUserInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutUserInputSchema),z.lazy(() => TagCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TagCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TagUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedCreateWithoutUserInputSchema),z.lazy(() => FeedCreateWithoutUserInputSchema).array(),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedWhereUniqueInputSchema),z.lazy(() => FeedWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FeedUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedScalarWhereInputSchema),z.lazy(() => FeedScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutUserInputSchema),z.lazy(() => FeedEntryCreateWithoutUserInputSchema).array(),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedEntryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedEntryUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FeedEntryUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedEntryScalarWhereInputSchema),z.lazy(() => FeedEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema).array(),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema),z.lazy(() => FeedEntryMediaCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryMediaCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedEntryMediaScalarWhereInputSchema),z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutUserInputSchema),z.lazy(() => CategoryCreateWithoutUserInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CategoryUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CategoryUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => CategoryUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutFeedsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFeedsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFeedsInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const FeedEntryCreateNestedManyWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryCreateNestedManyWithoutFeedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryCreateWithoutFeedInputSchema).array(),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema),z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryCreateManyFeedInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryUncheckedCreateNestedManyWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateNestedManyWithoutFeedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryCreateWithoutFeedInputSchema).array(),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema),z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryCreateManyFeedInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutFeedsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFeedsInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFeedsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutFeedsInputSchema),z.lazy(() => UserUpdateWithoutFeedsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedsInputSchema) ]).optional(),
}).strict();

export const FeedEntryUpdateManyWithoutFeedNestedInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyWithoutFeedNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryCreateWithoutFeedInputSchema).array(),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema),z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema),z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryCreateManyFeedInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema),z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedEntryUpdateManyWithWhereWithoutFeedInputSchema),z.lazy(() => FeedEntryUpdateManyWithWhereWithoutFeedInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedEntryScalarWhereInputSchema),z.lazy(() => FeedEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryUncheckedUpdateManyWithoutFeedNestedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutFeedNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryCreateWithoutFeedInputSchema).array(),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema),z.lazy(() => FeedEntryCreateOrConnectWithoutFeedInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema),z.lazy(() => FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryCreateManyFeedInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedEntryWhereUniqueInputSchema),z.lazy(() => FeedEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema),z.lazy(() => FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedEntryUpdateManyWithWhereWithoutFeedInputSchema),z.lazy(() => FeedEntryUpdateManyWithWhereWithoutFeedInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedEntryScalarWhereInputSchema),z.lazy(() => FeedEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryCreatecategoriesInputSchema: z.ZodType<Prisma.FeedEntryCreatecategoriesInput> = z.object({
  set: z.string().array()
}).strict();

export const FeedCreateNestedOneWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedCreateNestedOneWithoutFeedEntriesInput> = z.object({
  create: z.union([ z.lazy(() => FeedCreateWithoutFeedEntriesInputSchema),z.lazy(() => FeedUncheckedCreateWithoutFeedEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutFeedEntriesInputSchema).optional(),
  connect: z.lazy(() => FeedWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFeedEntriesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFeedEntriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedEntriesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const FeedEntryMediaCreateNestedManyWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateNestedManyWithoutFeedEntryInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema).array(),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema).array(),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryUpdatecategoriesInputSchema: z.ZodType<Prisma.FeedEntryUpdatecategoriesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const FeedUpdateOneRequiredWithoutFeedEntriesNestedInputSchema: z.ZodType<Prisma.FeedUpdateOneRequiredWithoutFeedEntriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedCreateWithoutFeedEntriesInputSchema),z.lazy(() => FeedUncheckedCreateWithoutFeedEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutFeedEntriesInputSchema).optional(),
  upsert: z.lazy(() => FeedUpsertWithoutFeedEntriesInputSchema).optional(),
  connect: z.lazy(() => FeedWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FeedUpdateToOneWithWhereWithoutFeedEntriesInputSchema),z.lazy(() => FeedUpdateWithoutFeedEntriesInputSchema),z.lazy(() => FeedUncheckedUpdateWithoutFeedEntriesInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutFeedEntriesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedEntriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFeedEntriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedEntriesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFeedEntriesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutFeedEntriesInputSchema),z.lazy(() => UserUpdateWithoutFeedEntriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedEntriesInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaUpdateManyWithoutFeedEntryNestedInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyWithoutFeedEntryNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema).array(),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedEntryMediaScalarWhereInputSchema),z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema).array(),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),z.lazy(() => FeedEntryMediaWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FeedEntryMediaScalarWhereInputSchema),z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FeedEntryCreateNestedOneWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryCreateNestedOneWithoutFeedMediaInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedMediaInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedMediaInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FeedEntryCreateOrConnectWithoutFeedMediaInputSchema).optional(),
  connect: z.lazy(() => FeedEntryWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFeedMediaInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFeedMediaInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedMediaInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedMediaInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInputSchema: z.ZodType<Prisma.FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInput> = z.object({
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedMediaInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedMediaInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FeedEntryCreateOrConnectWithoutFeedMediaInputSchema).optional(),
  upsert: z.lazy(() => FeedEntryUpsertWithoutFeedMediaInputSchema).optional(),
  connect: z.lazy(() => FeedEntryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FeedEntryUpdateToOneWithWhereWithoutFeedMediaInputSchema),z.lazy(() => FeedEntryUpdateWithoutFeedMediaInputSchema),z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedMediaInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutFeedMediaNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFeedMediaNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFeedMediaInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedMediaInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFeedMediaInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFeedMediaInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutFeedMediaInputSchema),z.lazy(() => UserUpdateWithoutFeedMediaInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedMediaInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const CategoryCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryCreateWithoutBookmarksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCategoriesInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutBookmarksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CategoryCreateOrConnectWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutBookmarksInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutBookmarksInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutBookmarksInputSchema) ]),
}).strict();

export const TagsOnBookmarksCreateWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateWithoutBookmarkInput> = z.object({
  tag: z.lazy(() => TagCreateNestedOneWithoutBookmarksInputSchema)
}).strict();

export const TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateWithoutBookmarkInput> = z.object({
  tagId: z.string()
}).strict();

export const TagsOnBookmarksCreateOrConnectWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateOrConnectWithoutBookmarkInput> = z.object({
  where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema) ]),
}).strict();

export const TagsOnBookmarksCreateManyBookmarkInputEnvelopeSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyBookmarkInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputSchema),z.lazy(() => TagsOnBookmarksCreateManyBookmarkInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.UserCreateWithoutBookmarksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutBookmarksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutBookmarksInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutBookmarksInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutBookmarksInputSchema),z.lazy(() => UserUncheckedCreateWithoutBookmarksInputSchema) ]),
}).strict();

export const CategoryUpsertWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutBookmarksInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutBookmarksInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutBookmarksInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutBookmarksInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutBookmarksInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryUpdateToOneWithWhereWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutBookmarksInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutBookmarksInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutBookmarksInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutBookmarksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutCategoriesNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutBookmarksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpsertWithWhereUniqueWithoutBookmarkInput> = z.object({
  where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TagsOnBookmarksUpdateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUncheckedUpdateWithoutBookmarkInputSchema) ]),
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutBookmarkInputSchema) ]),
}).strict();

export const TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateWithWhereUniqueWithoutBookmarkInput> = z.object({
  where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TagsOnBookmarksUpdateWithoutBookmarkInputSchema),z.lazy(() => TagsOnBookmarksUncheckedUpdateWithoutBookmarkInputSchema) ]),
}).strict();

export const TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithWhereWithoutBookmarkInput> = z.object({
  where: z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TagsOnBookmarksUpdateManyMutationInputSchema),z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkInputSchema) ]),
}).strict();

export const TagsOnBookmarksScalarWhereInputSchema: z.ZodType<Prisma.TagsOnBookmarksScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),z.lazy(() => TagsOnBookmarksScalarWhereInputSchema).array() ]).optional(),
  bookmarkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tagId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const UserUpsertWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUpsertWithoutBookmarksInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutBookmarksInputSchema),z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutBookmarksInputSchema),z.lazy(() => UserUncheckedCreateWithoutBookmarksInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutBookmarksInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutBookmarksInputSchema),z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputSchema) ]),
}).strict();

export const UserUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUpdateWithoutBookmarksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutBookmarksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const BookmarkCreateWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkCreateWithoutTagsInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutBookmarksInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutBookmarksInputSchema).optional()
}).strict();

export const BookmarkUncheckedCreateWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateWithoutTagsInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BookmarkCreateOrConnectWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => BookmarkWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookmarkCreateWithoutTagsInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const TagCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.TagCreateWithoutBookmarksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutTagsInputSchema).optional()
}).strict();

export const TagUncheckedCreateWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutBookmarksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TagCreateOrConnectWithoutBookmarksInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutBookmarksInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TagCreateWithoutBookmarksInputSchema),z.lazy(() => TagUncheckedCreateWithoutBookmarksInputSchema) ]),
}).strict();

export const BookmarkUpsertWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUpsertWithoutTagsInput> = z.object({
  update: z.union([ z.lazy(() => BookmarkUpdateWithoutTagsInputSchema),z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputSchema) ]),
  create: z.union([ z.lazy(() => BookmarkCreateWithoutTagsInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputSchema) ]),
  where: z.lazy(() => BookmarkWhereInputSchema).optional()
}).strict();

export const BookmarkUpdateToOneWithWhereWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUpdateToOneWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => BookmarkWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BookmarkUpdateWithoutTagsInputSchema),z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputSchema) ]),
}).strict();

export const BookmarkUpdateWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.lazy(() => CategoryUpdateOneWithoutBookmarksNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutBookmarksNestedInputSchema).optional()
}).strict();

export const BookmarkUncheckedUpdateWithoutTagsInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categoryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUpsertWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUpsertWithoutBookmarksInput> = z.object({
  update: z.union([ z.lazy(() => TagUpdateWithoutBookmarksInputSchema),z.lazy(() => TagUncheckedUpdateWithoutBookmarksInputSchema) ]),
  create: z.union([ z.lazy(() => TagCreateWithoutBookmarksInputSchema),z.lazy(() => TagUncheckedCreateWithoutBookmarksInputSchema) ]),
  where: z.lazy(() => TagWhereInputSchema).optional()
}).strict();

export const TagUpdateToOneWithWhereWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUpdateToOneWithWhereWithoutBookmarksInput> = z.object({
  where: z.lazy(() => TagWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TagUpdateWithoutBookmarksInputSchema),z.lazy(() => TagUncheckedUpdateWithoutBookmarksInputSchema) ]),
}).strict();

export const TagUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUpdateWithoutBookmarksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateWithoutBookmarksInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutBookmarksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksCreateWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateWithoutTagInput> = z.object({
  bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutTagsInputSchema)
}).strict();

export const TagsOnBookmarksUncheckedCreateWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedCreateWithoutTagInput> = z.object({
  bookmarkId: z.string()
}).strict();

export const TagsOnBookmarksCreateOrConnectWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateOrConnectWithoutTagInput> = z.object({
  where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema) ]),
}).strict();

export const TagsOnBookmarksCreateManyTagInputEnvelopeSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyTagInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TagsOnBookmarksCreateManyTagInputSchema),z.lazy(() => TagsOnBookmarksCreateManyTagInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateWithoutTagsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTagsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTagsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpsertWithWhereUniqueWithoutTagInput> = z.object({
  where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TagsOnBookmarksUpdateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUncheckedUpdateWithoutTagInputSchema) ]),
  create: z.union([ z.lazy(() => TagsOnBookmarksCreateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUncheckedCreateWithoutTagInputSchema) ]),
}).strict();

export const TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateWithWhereUniqueWithoutTagInput> = z.object({
  where: z.lazy(() => TagsOnBookmarksWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TagsOnBookmarksUpdateWithoutTagInputSchema),z.lazy(() => TagsOnBookmarksUncheckedUpdateWithoutTagInputSchema) ]),
}).strict();

export const TagsOnBookmarksUpdateManyWithWhereWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyWithWhereWithoutTagInput> = z.object({
  where: z.lazy(() => TagsOnBookmarksScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TagsOnBookmarksUpdateManyMutationInputSchema),z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutTagInputSchema) ]),
}).strict();

export const UserUpsertWithoutTagsInputSchema: z.ZodType<Prisma.UserUpsertWithoutTagsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutTagsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTagsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutTagsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTagsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTagsInputSchema) ]),
}).strict();

export const UserUpdateWithoutTagsInputSchema: z.ZodType<Prisma.UserUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTagsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const BookmarkCreateWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkCreateWithoutCategoryInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutBookmarkInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutBookmarksInputSchema).optional()
}).strict();

export const BookmarkUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateWithoutCategoryInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInputSchema).optional()
}).strict();

export const BookmarkCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => BookmarkWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const BookmarkCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.BookmarkCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BookmarkCreateManyCategoryInputSchema),z.lazy(() => BookmarkCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.UserCreateWithoutCategoriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCategoriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCategoriesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCategoriesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCategoriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutCategoriesInputSchema) ]),
}).strict();

export const BookmarkUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => BookmarkWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BookmarkUpdateWithoutCategoryInputSchema),z.lazy(() => BookmarkUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => BookmarkCreateWithoutCategoryInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const BookmarkUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => BookmarkWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BookmarkUpdateWithoutCategoryInputSchema),z.lazy(() => BookmarkUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const BookmarkUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => BookmarkScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BookmarkUpdateManyMutationInputSchema),z.lazy(() => BookmarkUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const BookmarkScalarWhereInputSchema: z.ZodType<Prisma.BookmarkScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BookmarkScalarWhereInputSchema),z.lazy(() => BookmarkScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookmarkScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookmarkScalarWhereInputSchema),z.lazy(() => BookmarkScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  imageBlur: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  desc: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  categoryId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  archived: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserUpsertWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUpsertWithoutCategoriesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCategoriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCategoriesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCategoriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutCategoriesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCategoriesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCategoriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCategoriesInputSchema) ]),
}).strict();

export const UserUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUpdateWithoutCategoriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCategoriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
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
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
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
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BookmarkCreateWithoutUserInputSchema: z.ZodType<Prisma.BookmarkCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutBookmarksInputSchema).optional(),
  tags: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutBookmarkInputSchema).optional()
}).strict();

export const BookmarkUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutBookmarkInputSchema).optional()
}).strict();

export const BookmarkCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => BookmarkWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookmarkCreateWithoutUserInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const BookmarkCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.BookmarkCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BookmarkCreateManyUserInputSchema),z.lazy(() => BookmarkCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TagCreateWithoutUserInputSchema: z.ZodType<Prisma.TagCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksCreateNestedManyWithoutTagInputSchema).optional()
}).strict();

export const TagUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksUncheckedCreateNestedManyWithoutTagInputSchema).optional()
}).strict();

export const TagCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TagCreateWithoutUserInputSchema),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TagCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.TagCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TagCreateManyUserInputSchema),z.lazy(() => TagCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FeedCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  url: z.string(),
  description: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  copyright: z.string().optional().nullable(),
  lastFetched: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutFeedInputSchema).optional()
}).strict();

export const FeedUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  url: z.string(),
  description: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  copyright: z.string().optional().nullable(),
  lastFetched: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutFeedInputSchema).optional()
}).strict();

export const FeedCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FeedCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => FeedWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FeedCreateWithoutUserInputSchema),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FeedCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FeedCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FeedCreateManyUserInputSchema),z.lazy(() => FeedCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FeedEntryCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryCreateWithoutUserInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feed: z.lazy(() => FeedCreateNestedOneWithoutFeedEntriesInputSchema),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutFeedEntryInputSchema).optional()
}).strict();

export const FeedEntryUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutUserInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInputSchema).optional()
}).strict();

export const FeedEntryCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutUserInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FeedEntryCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FeedEntryCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FeedEntryCreateManyUserInputSchema),z.lazy(() => FeedEntryCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FeedEntryMediaCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feedEntry: z.lazy(() => FeedEntryCreateNestedOneWithoutFeedMediaInputSchema)
}).strict();

export const FeedEntryMediaUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  feedEntryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryMediaCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FeedEntryMediaCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FeedEntryMediaCreateManyUserInputSchema),z.lazy(() => FeedEntryMediaCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CategoryCreateWithoutUserInputSchema: z.ZodType<Prisma.CategoryCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutUserInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const CategoryCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.CategoryCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CategoryCreateManyUserInputSchema),z.lazy(() => CategoryCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const BookmarkUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => BookmarkWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BookmarkUpdateWithoutUserInputSchema),z.lazy(() => BookmarkUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => BookmarkCreateWithoutUserInputSchema),z.lazy(() => BookmarkUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const BookmarkUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => BookmarkWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BookmarkUpdateWithoutUserInputSchema),z.lazy(() => BookmarkUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const BookmarkUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => BookmarkScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BookmarkUpdateManyMutationInputSchema),z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const TagUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TagUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TagUpdateWithoutUserInputSchema),z.lazy(() => TagUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => TagCreateWithoutUserInputSchema),z.lazy(() => TagUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TagUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TagUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TagUpdateWithoutUserInputSchema),z.lazy(() => TagUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const TagUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.TagUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => TagScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TagUpdateManyMutationInputSchema),z.lazy(() => TagUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const TagScalarWhereInputSchema: z.ZodType<Prisma.TagScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FeedUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FeedWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FeedUpdateWithoutUserInputSchema),z.lazy(() => FeedUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => FeedCreateWithoutUserInputSchema),z.lazy(() => FeedUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FeedUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FeedWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FeedUpdateWithoutUserInputSchema),z.lazy(() => FeedUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const FeedUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FeedUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => FeedScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FeedUpdateManyMutationInputSchema),z.lazy(() => FeedUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const FeedScalarWhereInputSchema: z.ZodType<Prisma.FeedScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FeedScalarWhereInputSchema),z.lazy(() => FeedScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedScalarWhereInputSchema),z.lazy(() => FeedScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  language: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  copyright: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastFetched: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FeedEntryUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FeedEntryUpdateWithoutUserInputSchema),z.lazy(() => FeedEntryUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutUserInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FeedEntryUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FeedEntryUpdateWithoutUserInputSchema),z.lazy(() => FeedEntryUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const FeedEntryUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => FeedEntryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FeedEntryUpdateManyMutationInputSchema),z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const FeedEntryScalarWhereInputSchema: z.ZodType<Prisma.FeedEntryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FeedEntryScalarWhereInputSchema),z.lazy(() => FeedEntryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedEntryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedEntryScalarWhereInputSchema),z.lazy(() => FeedEntryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  guid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contentSnippet: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  author: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ingested: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  published: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  unread: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  categories: z.lazy(() => StringNullableListFilterSchema).optional(),
  feedId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const FeedEntryMediaUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FeedEntryMediaUpdateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FeedEntryMediaUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FeedEntryMediaUpdateWithoutUserInputSchema),z.lazy(() => FeedEntryMediaUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const FeedEntryMediaUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FeedEntryMediaUpdateManyMutationInputSchema),z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const FeedEntryMediaScalarWhereInputSchema: z.ZodType<Prisma.FeedEntryMediaScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FeedEntryMediaScalarWhereInputSchema),z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FeedEntryMediaScalarWhereInputSchema),z.lazy(() => FeedEntryMediaScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  href: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  medium: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  height: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  width: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  credit: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  feedEntryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CategoryUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CategoryUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CategoryUpdateWithoutUserInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutUserInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const CategoryUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CategoryUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutUserInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const CategoryUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => CategoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CategoryUpdateManyMutationInputSchema),z.lazy(() => CategoryUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const CategoryScalarWhereInputSchema: z.ZodType<Prisma.CategoryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutFeedsInputSchema: z.ZodType<Prisma.UserCreateWithoutFeedsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutFeedsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFeedsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutFeedsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFeedsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutFeedsInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedsInputSchema) ]),
}).strict();

export const FeedEntryCreateWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryCreateWithoutFeedInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutFeedEntriesInputSchema),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutFeedEntryInputSchema).optional()
}).strict();

export const FeedEntryUncheckedCreateWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutFeedInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutFeedEntryInputSchema).optional()
}).strict();

export const FeedEntryCreateOrConnectWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutFeedInput> = z.object({
  where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema) ]),
}).strict();

export const FeedEntryCreateManyFeedInputEnvelopeSchema: z.ZodType<Prisma.FeedEntryCreateManyFeedInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FeedEntryCreateManyFeedInputSchema),z.lazy(() => FeedEntryCreateManyFeedInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutFeedsInputSchema: z.ZodType<Prisma.UserUpsertWithoutFeedsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutFeedsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutFeedsInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutFeedsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutFeedsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedsInputSchema) ]),
}).strict();

export const UserUpdateWithoutFeedsInputSchema: z.ZodType<Prisma.UserUpdateWithoutFeedsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutFeedsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const FeedEntryUpsertWithWhereUniqueWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUpsertWithWhereUniqueWithoutFeedInput> = z.object({
  where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FeedEntryUpdateWithoutFeedInputSchema),z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedInputSchema) ]),
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedInputSchema) ]),
}).strict();

export const FeedEntryUpdateWithWhereUniqueWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithWhereUniqueWithoutFeedInput> = z.object({
  where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FeedEntryUpdateWithoutFeedInputSchema),z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedInputSchema) ]),
}).strict();

export const FeedEntryUpdateManyWithWhereWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUpdateManyWithWhereWithoutFeedInput> = z.object({
  where: z.lazy(() => FeedEntryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FeedEntryUpdateManyMutationInputSchema),z.lazy(() => FeedEntryUncheckedUpdateManyWithoutFeedInputSchema) ]),
}).strict();

export const FeedCreateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedCreateWithoutFeedEntriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  url: z.string(),
  description: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  copyright: z.string().optional().nullable(),
  lastFetched: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutFeedsInputSchema)
}).strict();

export const FeedUncheckedCreateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUncheckedCreateWithoutFeedEntriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  url: z.string(),
  description: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  copyright: z.string().optional().nullable(),
  userId: z.string(),
  lastFetched: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedCreateOrConnectWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedCreateOrConnectWithoutFeedEntriesInput> = z.object({
  where: z.lazy(() => FeedWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FeedCreateWithoutFeedEntriesInputSchema),z.lazy(() => FeedUncheckedCreateWithoutFeedEntriesInputSchema) ]),
}).strict();

export const UserCreateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserCreateWithoutFeedEntriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFeedEntriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFeedEntriesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutFeedEntriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedEntriesInputSchema) ]),
}).strict();

export const FeedEntryMediaCreateWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateWithoutFeedEntryInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutFeedMediaInputSchema)
}).strict();

export const FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedCreateWithoutFeedEntryInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryMediaCreateOrConnectWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateOrConnectWithoutFeedEntryInput> = z.object({
  where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema) ]),
}).strict();

export const FeedEntryMediaCreateManyFeedEntryInputEnvelopeSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyFeedEntryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputSchema),z.lazy(() => FeedEntryMediaCreateManyFeedEntryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FeedUpsertWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUpsertWithoutFeedEntriesInput> = z.object({
  update: z.union([ z.lazy(() => FeedUpdateWithoutFeedEntriesInputSchema),z.lazy(() => FeedUncheckedUpdateWithoutFeedEntriesInputSchema) ]),
  create: z.union([ z.lazy(() => FeedCreateWithoutFeedEntriesInputSchema),z.lazy(() => FeedUncheckedCreateWithoutFeedEntriesInputSchema) ]),
  where: z.lazy(() => FeedWhereInputSchema).optional()
}).strict();

export const FeedUpdateToOneWithWhereWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUpdateToOneWithWhereWithoutFeedEntriesInput> = z.object({
  where: z.lazy(() => FeedWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FeedUpdateWithoutFeedEntriesInputSchema),z.lazy(() => FeedUncheckedUpdateWithoutFeedEntriesInputSchema) ]),
}).strict();

export const FeedUpdateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUpdateWithoutFeedEntriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFeedsNestedInputSchema).optional()
}).strict();

export const FeedUncheckedUpdateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateWithoutFeedEntriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpsertWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUpsertWithoutFeedEntriesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutFeedEntriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedEntriesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutFeedEntriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedEntriesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedEntriesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutFeedEntriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedEntriesInputSchema) ]),
}).strict();

export const UserUpdateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUpdateWithoutFeedEntriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutFeedEntriesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedEntriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUpsertWithWhereUniqueWithoutFeedEntryInput> = z.object({
  where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FeedEntryMediaUpdateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUncheckedUpdateWithoutFeedEntryInputSchema) ]),
  create: z.union([ z.lazy(() => FeedEntryMediaCreateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUncheckedCreateWithoutFeedEntryInputSchema) ]),
}).strict();

export const FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateWithWhereUniqueWithoutFeedEntryInput> = z.object({
  where: z.lazy(() => FeedEntryMediaWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FeedEntryMediaUpdateWithoutFeedEntryInputSchema),z.lazy(() => FeedEntryMediaUncheckedUpdateWithoutFeedEntryInputSchema) ]),
}).strict();

export const FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyWithWhereWithoutFeedEntryInput> = z.object({
  where: z.lazy(() => FeedEntryMediaScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FeedEntryMediaUpdateManyMutationInputSchema),z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryInputSchema) ]),
}).strict();

export const FeedEntryCreateWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryCreateWithoutFeedMediaInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  feed: z.lazy(() => FeedCreateNestedOneWithoutFeedEntriesInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutFeedEntriesInputSchema)
}).strict();

export const FeedEntryUncheckedCreateWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUncheckedCreateWithoutFeedMediaInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryCreateOrConnectWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryCreateOrConnectWithoutFeedMediaInput> = z.object({
  where: z.lazy(() => FeedEntryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedMediaInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedMediaInputSchema) ]),
}).strict();

export const UserCreateWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserCreateWithoutFeedMediaInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFeedMediaInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFeedMediaInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutFeedMediaInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedMediaInputSchema) ]),
}).strict();

export const FeedEntryUpsertWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUpsertWithoutFeedMediaInput> = z.object({
  update: z.union([ z.lazy(() => FeedEntryUpdateWithoutFeedMediaInputSchema),z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedMediaInputSchema) ]),
  create: z.union([ z.lazy(() => FeedEntryCreateWithoutFeedMediaInputSchema),z.lazy(() => FeedEntryUncheckedCreateWithoutFeedMediaInputSchema) ]),
  where: z.lazy(() => FeedEntryWhereInputSchema).optional()
}).strict();

export const FeedEntryUpdateToOneWithWhereWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUpdateToOneWithWhereWithoutFeedMediaInput> = z.object({
  where: z.lazy(() => FeedEntryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FeedEntryUpdateWithoutFeedMediaInputSchema),z.lazy(() => FeedEntryUncheckedUpdateWithoutFeedMediaInputSchema) ]),
}).strict();

export const FeedEntryUpdateWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithoutFeedMediaInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feed: z.lazy(() => FeedUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional()
}).strict();

export const FeedEntryUncheckedUpdateWithoutFeedMediaInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutFeedMediaInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpsertWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUpsertWithoutFeedMediaInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutFeedMediaInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedMediaInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutFeedMediaInputSchema),z.lazy(() => UserUncheckedCreateWithoutFeedMediaInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFeedMediaInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutFeedMediaInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFeedMediaInputSchema) ]),
}).strict();

export const UserUpdateWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUpdateWithoutFeedMediaInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutFeedMediaInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFeedMediaInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feeds: z.lazy(() => FeedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const TagsOnBookmarksCreateManyBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyBookmarkInput> = z.object({
  tagId: z.string()
}).strict();

export const TagsOnBookmarksUpdateWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateWithoutBookmarkInput> = z.object({
  tag: z.lazy(() => TagUpdateOneRequiredWithoutBookmarksNestedInputSchema).optional()
}).strict();

export const TagsOnBookmarksUncheckedUpdateWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateWithoutBookmarkInput> = z.object({
  tagId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkInput> = z.object({
  tagId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksCreateManyTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyTagInput> = z.object({
  bookmarkId: z.string()
}).strict();

export const TagsOnBookmarksUpdateWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateWithoutTagInput> = z.object({
  bookmark: z.lazy(() => BookmarkUpdateOneRequiredWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagsOnBookmarksUncheckedUpdateWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateWithoutTagInput> = z.object({
  bookmarkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagsOnBookmarksUncheckedUpdateManyWithoutTagInputSchema: z.ZodType<Prisma.TagsOnBookmarksUncheckedUpdateManyWithoutTagInput> = z.object({
  bookmarkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookmarkCreateManyCategoryInputSchema: z.ZodType<Prisma.BookmarkCreateManyCategoryInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BookmarkUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => TagsOnBookmarksUpdateManyWithoutBookmarkNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutBookmarksNestedInputSchema).optional()
}).strict();

export const BookmarkUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInputSchema).optional()
}).strict();

export const BookmarkUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutCategoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
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
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const BookmarkCreateManyUserInputSchema: z.ZodType<Prisma.BookmarkCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string().optional().nullable(),
  url: z.string(),
  image: z.string().optional().nullable(),
  imageBlur: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TagCreateManyUserInputSchema: z.ZodType<Prisma.TagCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedCreateManyUserInputSchema: z.ZodType<Prisma.FeedCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  url: z.string(),
  description: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  copyright: z.string().optional().nullable(),
  lastFetched: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryCreateManyUserInputSchema: z.ZodType<Prisma.FeedEntryCreateManyUserInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryMediaCreateManyUserInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  feedEntryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CategoryCreateManyUserInputSchema: z.ZodType<Prisma.CategoryCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookmarkUpdateWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.lazy(() => CategoryUpdateOneWithoutBookmarksNestedInputSchema).optional(),
  tags: z.lazy(() => TagsOnBookmarksUpdateManyWithoutBookmarkNestedInputSchema).optional()
}).strict();

export const BookmarkUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categoryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutBookmarkNestedInputSchema).optional()
}).strict();

export const BookmarkUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageBlur: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  desc: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categoryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUpdateWithoutUserInputSchema: z.ZodType<Prisma.TagUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksUpdateManyWithoutTagNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  bookmarks: z.lazy(() => TagsOnBookmarksUncheckedUpdateManyWithoutTagNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feedEntries: z.lazy(() => FeedEntryUpdateManyWithoutFeedNestedInputSchema).optional()
}).strict();

export const FeedUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feedEntries: z.lazy(() => FeedEntryUncheckedUpdateManyWithoutFeedNestedInputSchema).optional()
}).strict();

export const FeedUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.FeedUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  copyright: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastFetched: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feed: z.lazy(() => FeedUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutFeedEntryNestedInputSchema).optional()
}).strict();

export const FeedEntryUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInputSchema).optional()
}).strict();

export const FeedEntryUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  feedId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feedEntry: z.lazy(() => FeedEntryUpdateOneRequiredWithoutFeedMediaNestedInputSchema).optional()
}).strict();

export const FeedEntryMediaUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  feedEntryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  feedEntryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUpdateWithoutUserInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  bookmarks: z.lazy(() => BookmarkUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  bookmarks: z.lazy(() => BookmarkUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryCreateManyFeedInputSchema: z.ZodType<Prisma.FeedEntryCreateManyFeedInput> = z.object({
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
  categories: z.union([ z.lazy(() => FeedEntryCreatecategoriesInputSchema),z.string().array() ]).optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryUpdateWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUpdateWithoutFeedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFeedEntriesNestedInputSchema).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUpdateManyWithoutFeedEntryNestedInputSchema).optional()
}).strict();

export const FeedEntryUncheckedUpdateWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateWithoutFeedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  feedMedia: z.lazy(() => FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryNestedInputSchema).optional()
}).strict();

export const FeedEntryUncheckedUpdateManyWithoutFeedInputSchema: z.ZodType<Prisma.FeedEntryUncheckedUpdateManyWithoutFeedInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  guid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contentSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  author: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ingested: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  published: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.union([ z.lazy(() => FeedEntryUpdatecategoriesInputSchema),z.string().array() ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaCreateManyFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyFeedEntryInput> = z.object({
  id: z.string().cuid().optional(),
  href: z.string(),
  title: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  height: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const FeedEntryMediaUpdateWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUpdateWithoutFeedEntryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFeedMediaNestedInputSchema).optional()
}).strict();

export const FeedEntryMediaUncheckedUpdateWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateWithoutFeedEntryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryInputSchema: z.ZodType<Prisma.FeedEntryMediaUncheckedUpdateManyWithoutFeedEntryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  href: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  medium: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  height: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  width: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const BookmarkFindFirstArgsSchema: z.ZodType<Prisma.BookmarkFindFirstArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  where: BookmarkWhereInputSchema.optional(),
  orderBy: z.union([ BookmarkOrderByWithRelationAndSearchRelevanceInputSchema.array(),BookmarkOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: BookmarkWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookmarkScalarFieldEnumSchema,BookmarkScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BookmarkFindFirstOrThrowArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  where: BookmarkWhereInputSchema.optional(),
  orderBy: z.union([ BookmarkOrderByWithRelationAndSearchRelevanceInputSchema.array(),BookmarkOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: BookmarkWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookmarkScalarFieldEnumSchema,BookmarkScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkFindManyArgsSchema: z.ZodType<Prisma.BookmarkFindManyArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  where: BookmarkWhereInputSchema.optional(),
  orderBy: z.union([ BookmarkOrderByWithRelationAndSearchRelevanceInputSchema.array(),BookmarkOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: BookmarkWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookmarkScalarFieldEnumSchema,BookmarkScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkAggregateArgsSchema: z.ZodType<Prisma.BookmarkAggregateArgs> = z.object({
  where: BookmarkWhereInputSchema.optional(),
  orderBy: z.union([ BookmarkOrderByWithRelationAndSearchRelevanceInputSchema.array(),BookmarkOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: BookmarkWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BookmarkGroupByArgsSchema: z.ZodType<Prisma.BookmarkGroupByArgs> = z.object({
  where: BookmarkWhereInputSchema.optional(),
  orderBy: z.union([ BookmarkOrderByWithAggregationInputSchema.array(),BookmarkOrderByWithAggregationInputSchema ]).optional(),
  by: BookmarkScalarFieldEnumSchema.array(),
  having: BookmarkScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BookmarkFindUniqueArgsSchema: z.ZodType<Prisma.BookmarkFindUniqueArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  where: BookmarkWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BookmarkFindUniqueOrThrowArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  where: BookmarkWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksFindFirstArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindFirstArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  where: TagsOnBookmarksWhereInputSchema.optional(),
  orderBy: z.union([ TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema.array(),TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: TagsOnBookmarksWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagsOnBookmarksScalarFieldEnumSchema,TagsOnBookmarksScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindFirstOrThrowArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  where: TagsOnBookmarksWhereInputSchema.optional(),
  orderBy: z.union([ TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema.array(),TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: TagsOnBookmarksWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagsOnBookmarksScalarFieldEnumSchema,TagsOnBookmarksScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksFindManyArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindManyArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  where: TagsOnBookmarksWhereInputSchema.optional(),
  orderBy: z.union([ TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema.array(),TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: TagsOnBookmarksWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagsOnBookmarksScalarFieldEnumSchema,TagsOnBookmarksScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksAggregateArgsSchema: z.ZodType<Prisma.TagsOnBookmarksAggregateArgs> = z.object({
  where: TagsOnBookmarksWhereInputSchema.optional(),
  orderBy: z.union([ TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema.array(),TagsOnBookmarksOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: TagsOnBookmarksWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagsOnBookmarksGroupByArgsSchema: z.ZodType<Prisma.TagsOnBookmarksGroupByArgs> = z.object({
  where: TagsOnBookmarksWhereInputSchema.optional(),
  orderBy: z.union([ TagsOnBookmarksOrderByWithAggregationInputSchema.array(),TagsOnBookmarksOrderByWithAggregationInputSchema ]).optional(),
  by: TagsOnBookmarksScalarFieldEnumSchema.array(),
  having: TagsOnBookmarksScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagsOnBookmarksFindUniqueArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindUniqueArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  where: TagsOnBookmarksWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TagsOnBookmarksFindUniqueOrThrowArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  where: TagsOnBookmarksWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagFindFirstArgsSchema: z.ZodType<Prisma.TagFindFirstArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationAndSearchRelevanceInputSchema.array(),TagOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TagFindFirstOrThrowArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationAndSearchRelevanceInputSchema.array(),TagOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagFindManyArgsSchema: z.ZodType<Prisma.TagFindManyArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationAndSearchRelevanceInputSchema.array(),TagOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagAggregateArgsSchema: z.ZodType<Prisma.TagAggregateArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationAndSearchRelevanceInputSchema.array(),TagOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagGroupByArgsSchema: z.ZodType<Prisma.TagGroupByArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithAggregationInputSchema.array(),TagOrderByWithAggregationInputSchema ]).optional(),
  by: TagScalarFieldEnumSchema.array(),
  having: TagScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagFindUniqueArgsSchema: z.ZodType<Prisma.TagFindUniqueArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TagFindUniqueOrThrowArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationAndSearchRelevanceInputSchema.array(),CategoryOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationAndSearchRelevanceInputSchema.array(),CategoryOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationAndSearchRelevanceInputSchema.array(),CategoryOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationAndSearchRelevanceInputSchema.array(),CategoryOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(),CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(),
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationAndSearchRelevanceInputSchema.array(),AccountOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationAndSearchRelevanceInputSchema.array(),AccountOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationAndSearchRelevanceInputSchema.array(),AccountOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationAndSearchRelevanceInputSchema.array(),AccountOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationAndSearchRelevanceInputSchema.array(),SessionOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationAndSearchRelevanceInputSchema.array(),SessionOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationAndSearchRelevanceInputSchema.array(),SessionOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationAndSearchRelevanceInputSchema.array(),SessionOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationAndSearchRelevanceInputSchema.array(),UserOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationAndSearchRelevanceInputSchema.array(),UserOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationAndSearchRelevanceInputSchema.array(),UserOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationAndSearchRelevanceInputSchema.array(),UserOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema.array(),VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema.array(),VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema.array(),VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema.array(),VerificationTokenOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithAggregationInputSchema.array(),VerificationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationTokenScalarFieldEnumSchema.array(),
  having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedFindFirstArgsSchema: z.ZodType<Prisma.FeedFindFirstArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  where: FeedWhereInputSchema.optional(),
  orderBy: z.union([ FeedOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedScalarFieldEnumSchema,FeedScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FeedFindFirstOrThrowArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  where: FeedWhereInputSchema.optional(),
  orderBy: z.union([ FeedOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedScalarFieldEnumSchema,FeedScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedFindManyArgsSchema: z.ZodType<Prisma.FeedFindManyArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  where: FeedWhereInputSchema.optional(),
  orderBy: z.union([ FeedOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedScalarFieldEnumSchema,FeedScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedAggregateArgsSchema: z.ZodType<Prisma.FeedAggregateArgs> = z.object({
  where: FeedWhereInputSchema.optional(),
  orderBy: z.union([ FeedOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FeedGroupByArgsSchema: z.ZodType<Prisma.FeedGroupByArgs> = z.object({
  where: FeedWhereInputSchema.optional(),
  orderBy: z.union([ FeedOrderByWithAggregationInputSchema.array(),FeedOrderByWithAggregationInputSchema ]).optional(),
  by: FeedScalarFieldEnumSchema.array(),
  having: FeedScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FeedFindUniqueArgsSchema: z.ZodType<Prisma.FeedFindUniqueArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  where: FeedWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FeedFindUniqueOrThrowArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  where: FeedWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryFindFirstArgsSchema: z.ZodType<Prisma.FeedEntryFindFirstArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  where: FeedEntryWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedEntryScalarFieldEnumSchema,FeedEntryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FeedEntryFindFirstOrThrowArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  where: FeedEntryWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedEntryScalarFieldEnumSchema,FeedEntryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryFindManyArgsSchema: z.ZodType<Prisma.FeedEntryFindManyArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  where: FeedEntryWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedEntryScalarFieldEnumSchema,FeedEntryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryAggregateArgsSchema: z.ZodType<Prisma.FeedEntryAggregateArgs> = z.object({
  where: FeedEntryWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedEntryOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FeedEntryGroupByArgsSchema: z.ZodType<Prisma.FeedEntryGroupByArgs> = z.object({
  where: FeedEntryWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryOrderByWithAggregationInputSchema.array(),FeedEntryOrderByWithAggregationInputSchema ]).optional(),
  by: FeedEntryScalarFieldEnumSchema.array(),
  having: FeedEntryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FeedEntryFindUniqueArgsSchema: z.ZodType<Prisma.FeedEntryFindUniqueArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  where: FeedEntryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FeedEntryFindUniqueOrThrowArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  where: FeedEntryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaFindFirstArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindFirstArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  where: FeedEntryMediaWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedEntryMediaWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedEntryMediaScalarFieldEnumSchema,FeedEntryMediaScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindFirstOrThrowArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  where: FeedEntryMediaWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedEntryMediaWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedEntryMediaScalarFieldEnumSchema,FeedEntryMediaScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaFindManyArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindManyArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  where: FeedEntryMediaWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedEntryMediaWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FeedEntryMediaScalarFieldEnumSchema,FeedEntryMediaScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaAggregateArgsSchema: z.ZodType<Prisma.FeedEntryMediaAggregateArgs> = z.object({
  where: FeedEntryMediaWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema.array(),FeedEntryMediaOrderByWithRelationAndSearchRelevanceInputSchema ]).optional(),
  cursor: FeedEntryMediaWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FeedEntryMediaGroupByArgsSchema: z.ZodType<Prisma.FeedEntryMediaGroupByArgs> = z.object({
  where: FeedEntryMediaWhereInputSchema.optional(),
  orderBy: z.union([ FeedEntryMediaOrderByWithAggregationInputSchema.array(),FeedEntryMediaOrderByWithAggregationInputSchema ]).optional(),
  by: FeedEntryMediaScalarFieldEnumSchema.array(),
  having: FeedEntryMediaScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FeedEntryMediaFindUniqueArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindUniqueArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  where: FeedEntryMediaWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FeedEntryMediaFindUniqueOrThrowArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  where: FeedEntryMediaWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkCreateArgsSchema: z.ZodType<Prisma.BookmarkCreateArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  data: z.union([ BookmarkCreateInputSchema,BookmarkUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkUpsertArgsSchema: z.ZodType<Prisma.BookmarkUpsertArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  where: BookmarkWhereUniqueInputSchema,
  create: z.union([ BookmarkCreateInputSchema,BookmarkUncheckedCreateInputSchema ]),
  update: z.union([ BookmarkUpdateInputSchema,BookmarkUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkCreateManyArgsSchema: z.ZodType<Prisma.BookmarkCreateManyArgs> = z.object({
  data: z.union([ BookmarkCreateManyInputSchema,BookmarkCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BookmarkDeleteArgsSchema: z.ZodType<Prisma.BookmarkDeleteArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  where: BookmarkWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkUpdateArgsSchema: z.ZodType<Prisma.BookmarkUpdateArgs> = z.object({
  select: BookmarkSelectSchema.optional(),
  include: BookmarkIncludeSchema.optional(),
  data: z.union([ BookmarkUpdateInputSchema,BookmarkUncheckedUpdateInputSchema ]),
  where: BookmarkWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BookmarkUpdateManyArgsSchema: z.ZodType<Prisma.BookmarkUpdateManyArgs> = z.object({
  data: z.union([ BookmarkUpdateManyMutationInputSchema,BookmarkUncheckedUpdateManyInputSchema ]),
  where: BookmarkWhereInputSchema.optional(),
}).strict() ;

export const BookmarkDeleteManyArgsSchema: z.ZodType<Prisma.BookmarkDeleteManyArgs> = z.object({
  where: BookmarkWhereInputSchema.optional(),
}).strict() ;

export const TagsOnBookmarksCreateArgsSchema: z.ZodType<Prisma.TagsOnBookmarksCreateArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  data: z.union([ TagsOnBookmarksCreateInputSchema,TagsOnBookmarksUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksUpsertArgsSchema: z.ZodType<Prisma.TagsOnBookmarksUpsertArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  where: TagsOnBookmarksWhereUniqueInputSchema,
  create: z.union([ TagsOnBookmarksCreateInputSchema,TagsOnBookmarksUncheckedCreateInputSchema ]),
  update: z.union([ TagsOnBookmarksUpdateInputSchema,TagsOnBookmarksUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksCreateManyArgsSchema: z.ZodType<Prisma.TagsOnBookmarksCreateManyArgs> = z.object({
  data: z.union([ TagsOnBookmarksCreateManyInputSchema,TagsOnBookmarksCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TagsOnBookmarksDeleteArgsSchema: z.ZodType<Prisma.TagsOnBookmarksDeleteArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  where: TagsOnBookmarksWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksUpdateArgsSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateArgs> = z.object({
  select: TagsOnBookmarksSelectSchema.optional(),
  include: TagsOnBookmarksIncludeSchema.optional(),
  data: z.union([ TagsOnBookmarksUpdateInputSchema,TagsOnBookmarksUncheckedUpdateInputSchema ]),
  where: TagsOnBookmarksWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagsOnBookmarksUpdateManyArgsSchema: z.ZodType<Prisma.TagsOnBookmarksUpdateManyArgs> = z.object({
  data: z.union([ TagsOnBookmarksUpdateManyMutationInputSchema,TagsOnBookmarksUncheckedUpdateManyInputSchema ]),
  where: TagsOnBookmarksWhereInputSchema.optional(),
}).strict() ;

export const TagsOnBookmarksDeleteManyArgsSchema: z.ZodType<Prisma.TagsOnBookmarksDeleteManyArgs> = z.object({
  where: TagsOnBookmarksWhereInputSchema.optional(),
}).strict() ;

export const TagCreateArgsSchema: z.ZodType<Prisma.TagCreateArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  data: z.union([ TagCreateInputSchema,TagUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagUpsertArgsSchema: z.ZodType<Prisma.TagUpsertArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
  create: z.union([ TagCreateInputSchema,TagUncheckedCreateInputSchema ]),
  update: z.union([ TagUpdateInputSchema,TagUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagCreateManyArgsSchema: z.ZodType<Prisma.TagCreateManyArgs> = z.object({
  data: z.union([ TagCreateManyInputSchema,TagCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TagDeleteArgsSchema: z.ZodType<Prisma.TagDeleteArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagUpdateArgsSchema: z.ZodType<Prisma.TagUpdateArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  data: z.union([ TagUpdateInputSchema,TagUncheckedUpdateInputSchema ]),
  where: TagWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const TagUpdateManyArgsSchema: z.ZodType<Prisma.TagUpdateManyArgs> = z.object({
  data: z.union([ TagUpdateManyMutationInputSchema,TagUncheckedUpdateManyInputSchema ]),
  where: TagWhereInputSchema.optional(),
}).strict() ;

export const TagDeleteManyArgsSchema: z.ZodType<Prisma.TagDeleteManyArgs> = z.object({
  where: TagWhereInputSchema.optional(),
}).strict() ;

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  create: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema,CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(),
}).strict() ;

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  create: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
  update: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
  where: VerificationTokenWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema,VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(),
}).strict() ;

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
}).strict() ;

export const FeedCreateArgsSchema: z.ZodType<Prisma.FeedCreateArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  data: z.union([ FeedCreateInputSchema,FeedUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedUpsertArgsSchema: z.ZodType<Prisma.FeedUpsertArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  where: FeedWhereUniqueInputSchema,
  create: z.union([ FeedCreateInputSchema,FeedUncheckedCreateInputSchema ]),
  update: z.union([ FeedUpdateInputSchema,FeedUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedCreateManyArgsSchema: z.ZodType<Prisma.FeedCreateManyArgs> = z.object({
  data: z.union([ FeedCreateManyInputSchema,FeedCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FeedDeleteArgsSchema: z.ZodType<Prisma.FeedDeleteArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  where: FeedWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedUpdateArgsSchema: z.ZodType<Prisma.FeedUpdateArgs> = z.object({
  select: FeedSelectSchema.optional(),
  include: FeedIncludeSchema.optional(),
  data: z.union([ FeedUpdateInputSchema,FeedUncheckedUpdateInputSchema ]),
  where: FeedWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedUpdateManyArgsSchema: z.ZodType<Prisma.FeedUpdateManyArgs> = z.object({
  data: z.union([ FeedUpdateManyMutationInputSchema,FeedUncheckedUpdateManyInputSchema ]),
  where: FeedWhereInputSchema.optional(),
}).strict() ;

export const FeedDeleteManyArgsSchema: z.ZodType<Prisma.FeedDeleteManyArgs> = z.object({
  where: FeedWhereInputSchema.optional(),
}).strict() ;

export const FeedEntryCreateArgsSchema: z.ZodType<Prisma.FeedEntryCreateArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  data: z.union([ FeedEntryCreateInputSchema,FeedEntryUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryUpsertArgsSchema: z.ZodType<Prisma.FeedEntryUpsertArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  where: FeedEntryWhereUniqueInputSchema,
  create: z.union([ FeedEntryCreateInputSchema,FeedEntryUncheckedCreateInputSchema ]),
  update: z.union([ FeedEntryUpdateInputSchema,FeedEntryUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryCreateManyArgsSchema: z.ZodType<Prisma.FeedEntryCreateManyArgs> = z.object({
  data: z.union([ FeedEntryCreateManyInputSchema,FeedEntryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FeedEntryDeleteArgsSchema: z.ZodType<Prisma.FeedEntryDeleteArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  where: FeedEntryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryUpdateArgsSchema: z.ZodType<Prisma.FeedEntryUpdateArgs> = z.object({
  select: FeedEntrySelectSchema.optional(),
  include: FeedEntryIncludeSchema.optional(),
  data: z.union([ FeedEntryUpdateInputSchema,FeedEntryUncheckedUpdateInputSchema ]),
  where: FeedEntryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryUpdateManyArgsSchema: z.ZodType<Prisma.FeedEntryUpdateManyArgs> = z.object({
  data: z.union([ FeedEntryUpdateManyMutationInputSchema,FeedEntryUncheckedUpdateManyInputSchema ]),
  where: FeedEntryWhereInputSchema.optional(),
}).strict() ;

export const FeedEntryDeleteManyArgsSchema: z.ZodType<Prisma.FeedEntryDeleteManyArgs> = z.object({
  where: FeedEntryWhereInputSchema.optional(),
}).strict() ;

export const FeedEntryMediaCreateArgsSchema: z.ZodType<Prisma.FeedEntryMediaCreateArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  data: z.union([ FeedEntryMediaCreateInputSchema,FeedEntryMediaUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaUpsertArgsSchema: z.ZodType<Prisma.FeedEntryMediaUpsertArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  where: FeedEntryMediaWhereUniqueInputSchema,
  create: z.union([ FeedEntryMediaCreateInputSchema,FeedEntryMediaUncheckedCreateInputSchema ]),
  update: z.union([ FeedEntryMediaUpdateInputSchema,FeedEntryMediaUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaCreateManyArgsSchema: z.ZodType<Prisma.FeedEntryMediaCreateManyArgs> = z.object({
  data: z.union([ FeedEntryMediaCreateManyInputSchema,FeedEntryMediaCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FeedEntryMediaDeleteArgsSchema: z.ZodType<Prisma.FeedEntryMediaDeleteArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  where: FeedEntryMediaWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaUpdateArgsSchema: z.ZodType<Prisma.FeedEntryMediaUpdateArgs> = z.object({
  select: FeedEntryMediaSelectSchema.optional(),
  include: FeedEntryMediaIncludeSchema.optional(),
  data: z.union([ FeedEntryMediaUpdateInputSchema,FeedEntryMediaUncheckedUpdateInputSchema ]),
  where: FeedEntryMediaWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const FeedEntryMediaUpdateManyArgsSchema: z.ZodType<Prisma.FeedEntryMediaUpdateManyArgs> = z.object({
  data: z.union([ FeedEntryMediaUpdateManyMutationInputSchema,FeedEntryMediaUncheckedUpdateManyInputSchema ]),
  where: FeedEntryMediaWhereInputSchema.optional(),
}).strict() ;

export const FeedEntryMediaDeleteManyArgsSchema: z.ZodType<Prisma.FeedEntryMediaDeleteManyArgs> = z.object({
  where: FeedEntryMediaWhereInputSchema.optional(),
}).strict() ;
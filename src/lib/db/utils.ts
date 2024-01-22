import type { SQLiteSelect } from "drizzle-orm/sqlite-core"

export function withPagination<T extends SQLiteSelect>(qb: T, skip: number, pageSize: number = 10) {
  return qb.limit(pageSize).offset(skip)
}

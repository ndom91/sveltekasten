declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET?: string

    R2_ACCESS_KEY?: string
    R2_SECRET_KEY?: string
    R2_ACCOUNT_ID?: string
    R2_BUCKET_URL?: string

    /**
     * Vercel environment variables
     */
    VERCEL?: string;
    VERCEL_ENV?: 'production' | 'development' | 'preview';
    VERCEL_URL?: string;

    /**
     * Prisma
     */
    DATABASE_URL?: string;
    POSTGRES_URL?: string;
    POSTGRES_PRISMA_URL?: string;
    POSTGRES_URL_NON_POOLING?: string;
  }
}

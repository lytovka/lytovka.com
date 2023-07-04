declare namespace NodeJS {
  export interface ProcessEnv {
    REDIS_URL: string;
    REDIS_URL_LOCAL: string;
    SESSION_SECRET: string;
    USER_SESSION_SECRET: string;
    SPOTIFY_API_BASE_URL: string;
    SPOTIFY_API_CLIENT_ID: string;
    SPOTIFY_API_CLIENT_SECRET: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    UPSTASH_REDIS_REST_URL: string;
  }
}

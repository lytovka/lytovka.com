declare namespace NodeJS {
  export interface ProcessEnv {
    REDIS_URL: string;
    SESSION_SECRET: string;
    SPOTIFY_API_BASE_URL: string;
    SPOTIFY_API_CLIENT_ID: string;
    SPOTIFY_API_CLIENT_SECRET: string;
  }
}

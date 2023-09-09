declare namespace NodeJS {
  export interface ProcessEnv {
    SESSION_SECRET: string;
    USER_SESSION_SECRET: string;
    SPOTIFY_API_BASE_URL: string;
    SPOTIFY_API_CLIENT_ID: string;
    SPOTIFY_API_CLIENT_SECRET: string;
  }
}

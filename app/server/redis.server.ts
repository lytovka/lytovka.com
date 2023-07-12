import { Redis } from "ioredis";

const VIEWS_KEY = "lytovka-com:views";

export type Views = {
  [key: string]: string;
};

const redis = new Redis(
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL
    : process.env.REDIS_URL_LOCAL,
);

export async function fetchAllViews() {
  return redis.hgetall(VIEWS_KEY);
}

export async function fetchViewsBySlug(slug: string) {
  return redis.hget(VIEWS_KEY, slug);
}

export async function fetchViewsIncrement(slug: string) {
  return redis.hincrby(VIEWS_KEY, slug, 1);
}

export default redis;

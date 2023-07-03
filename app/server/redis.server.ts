import { Redis } from "@upstash/redis/nodejs";

const VIEWS_KEY = "lytovka-com:views";

type Views = {
  [key: string]: number;
};

const redis = Redis.fromEnv();

export async function fetchViewsAll() {
  return redis.hgetall<Views>(VIEWS_KEY);
}

export async function fetchViewsBySlug(slug: string) {
  return redis.hget<number>(VIEWS_KEY, slug);
}

export async function fetchViewsIncrement(slug: string) {
  return redis.hincrby(VIEWS_KEY, slug, 1);
}

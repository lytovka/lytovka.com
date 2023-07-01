/* eslint-disable import/no-mutable-exports */
/* eslint-disable vars-on-top */
import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

if (!global.__redis) {
  global.__redis = new Redis(process.env.REDIS_URL);
}

const redis = global.__redis;

export { redis };

redis.on("error", (err) => {
  console.log("Redis Client Error", err);
});

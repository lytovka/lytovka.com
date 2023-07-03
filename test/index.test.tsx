import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { loader } from "~/routes/notes._index";
import type { Note } from "~/server/markdown.server";
import type { StartedTestContainer } from "testcontainers";
import { GenericContainer } from "testcontainers";
import Redis from "ioredis";

describe("Index page", () => {
  let container: StartedTestContainer;
  let redisClient: Redis;

  beforeAll(async () => {
    console.log("Starting Redis container...");
    container = await new GenericContainer("redis")
      // exposes the internal Docker port to the host machine
      .withExposedPorts(6379)
      .start();
    console.log("Started Redis container...");

    console.log("connecting to Redis client...");
    redisClient = new Redis({
      host: container.getHost(),
      // retrieves the port on the host machine which maps
      // to the exposed port in the Docker container
      port: container.getMappedPort(6379),
    });
    console.log("connected to Redis client...");
  });

  afterAll(async () => {
    console.log("flushing container and client...");
    await container.stop();
    await redisClient.quit();
    console.log("flushed container and client...");
  });

  it("loader: should return Request object", async () => {
    const response = (await loader({
      request: new Request("http://localhost:3000"),
      params: {},
      context: {},
    })) as Response;

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toEqual(200);
    expect(response.ok).toEqual(true);

    const data = (await response.json()) as Array<Note>;

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });
});

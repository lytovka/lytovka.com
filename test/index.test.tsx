import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { loader } from "~/routes/notes._index";
import type { Note } from "~/server/markdown.server";
import type { StartedTestContainer } from "testcontainers";
import { GenericContainer } from "testcontainers";

describe("Index page", () => {
  let container: StartedTestContainer;

  beforeAll(async () => {
    container = await new GenericContainer("redis")
      // exposes the internal Docker port to the host machine
      .withExposedPorts(6379)
      .start();
  });

  afterAll(async () => {
    await container.stop();
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

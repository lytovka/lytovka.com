import { describe, it, expect, vi } from "vitest";
import { loader } from "~/routes/notes._index";
import type { Note } from "~/server/markdown.server";

vi.mock("ioredis");

describe("Index page", () => {
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

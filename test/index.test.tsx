import { describe, it, expect } from "vitest";
import type { posts } from "@prisma/client";
import { loader } from "../app/routes/notes";

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

    const data = (await response.json()) as Array<posts>;

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });
});

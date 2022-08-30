import { createRequestHandler } from "@remix-run/vercel";
import * as build from "@remix-run/dev/server-build";

// eslint-disable-next-line no-undef
export default createRequestHandler({ build, mode: process.env.NODE_ENV });

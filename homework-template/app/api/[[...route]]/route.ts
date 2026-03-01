import { Hono } from "hono";
import { handle } from "hono/vercel";
import plants from "../plants/plants.hono";
import { openAPIRouteHandler } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";

const app = new Hono().basePath("/api");

// Routes
app.route("/plants", plants);

// OpenAPI
app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      openapi: "3.2.0",
      info: {
        title: "Plants API",
        version: "1.0.0",
        description: "API for creating, reading, updating, and deleting apps.",
      },
    },
  }),
);

// Scalar Documentation
app.get(
  "/docs",
  Scalar({
    url: "/api/openapi.json",
  }),
);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

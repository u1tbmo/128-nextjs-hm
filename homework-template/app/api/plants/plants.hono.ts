import {
  CreatePlantSchema,
  PlantListResponseSchema,
  PlantResponseSchema,
  UpdatePlantSchema,
} from "@/app/types/plants";
import {
  ErrorResponseSchema,
  MessageResponseSchema,
} from "@/app/types/response";
import { db } from "@/lib/db";
import { Context, Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import z from "zod";

const plants = new Hono();

const validationHook = (
  result:
    | { success: true; data: unknown }
    | { success: false; error: readonly { message: string }[] },
  c: Context,
) => {
  if (!result.success) {
    const error = result.error.map((i) => i.message).join("; ");
    return c.json({ error }, 400);
  }
};

plants.get(
  "/",
  describeRoute({
    responses: {
      200: {
        description: "Retrieves all plants",
        content: {
          "application/json": {
            schema: resolver(PlantListResponseSchema),
          },
        },
      },
    },
  }),
  validator(
    "query",
    z.object({
      location: z.string().optional(),
    }),
    validationHook,
  ),
  async (c) => {
    const { location } = c.req.valid("query");
    const data = await db.findMany({ location });
    return c.json({ data, message: "Plants retrieved successfully" });
  },
);

plants.post(
  "/",
  describeRoute({
    responses: {
      201: {
        description: "Creates a new plant",
        content: {
          "application/json": {
            schema: resolver(MessageResponseSchema),
          },
        },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: resolver(ErrorResponseSchema),
          },
        },
      },
    },
  }),
  validator("json", CreatePlantSchema, validationHook),
  async (c) => {
    const { name, location, species } = c.req.valid("json");
    await db.create({
      name,
      location,
      species,
      status: "Healthy",
      lastWatered: new Date(),
    });

    return c.json({ message: `New plant ${name} created` }, 201);
  },
);

plants.get(
  "/:id",
  describeRoute({
    responses: {
      200: {
        description: "Retrieves a single plant by ID",
        content: {
          "application/json": {
            schema: resolver(PlantResponseSchema),
          },
        },
      },
      404: {
        description: "Plant not found",
        content: {
          "application/json": {
            schema: resolver(ErrorResponseSchema),
          },
        },
      },
    },
  }),
  validator("param", z.object({ id: z.string() }), validationHook),
  async (c) => {
    const { id } = c.req.valid("param");
    const plant = await db.findUnique(id);
    if (!plant) {
      return c.json({ error: `Plant with id ${id} not found` }, 404);
    }

    return c.json({ data: plant, message: "Plant retrieved successfully" });
  },
);

plants.patch(
  "/:id",
  describeRoute({
    responses: {
      200: {
        description: "Updates a plant by ID",
        content: {
          "application/json": {
            schema: resolver(PlantResponseSchema),
          },
        },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: resolver(ErrorResponseSchema),
          },
        },
      },
      404: {
        description: "Plant not found",
        content: {
          "application/json": {
            schema: resolver(ErrorResponseSchema),
          },
        },
      },
    },
  }),
  validator("param", z.object({ id: z.string() }), validationHook),
  validator("json", UpdatePlantSchema, validationHook),
  async (c) => {
    const { id } = c.req.valid("param");
    const { status, lastWatered } = c.req.valid("json");

    if (!status && !lastWatered) {
      return c.json({ error: "Missing status or lastWatered field" }, 400);
    }

    const updatedPlant = await db.update(id, {
      status,
      lastWatered: lastWatered ? new Date(lastWatered) : undefined,
    });

    if (!updatedPlant) {
      return c.json({ error: `Plant with id ${id} not found` }, 404);
    }

    return c.json({
      data: updatedPlant,
      message: "Plant updated successfully",
    });
  },
);

plants.delete(
  "/:id",
  describeRoute({
    responses: {
      200: {
        description: "Deletes a plant by ID",
        content: {
          "application/json": {
            schema: resolver(MessageResponseSchema),
          },
        },
      },
      404: {
        description: "Plant not found",
        content: {
          "application/json": {
            schema: resolver(ErrorResponseSchema),
          },
        },
      },
    },
  }),
  validator("param", z.object({ id: z.string() }), validationHook),
  async (c) => {
    const { id } = c.req.valid("param");

    const success = await db.delete(id);
    if (!success) {
      return c.json({ error: `Plant with id ${id} not found` }, 404);
    }

    return c.json({ message: "Plant successfully deleted" });
  },
);

export default plants;

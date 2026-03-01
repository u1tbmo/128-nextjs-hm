import { z } from "zod";

export const PlantStatusSchema = z
  .enum(["Healthy", "Thirsty", "Overwatered"])
  .describe("PlantStatus");

export const PlantSchema = z
  .object({
    id: z.string().describe("Unique identifier"),
    name: z.string().min(1).describe("Plant name"),
    species: z.string().min(1).describe("Plant species"),
    location: z.string().min(1).describe("Plant location"),
    lastWatered: z.iso.datetime("Invalid date format").describe("ISO 8601 timestamp"),
    status: PlantStatusSchema,
  })
  .describe("Plant");

export const CreatePlantSchema = PlantSchema.pick({
  name: true,
  species: true,
  location: true,
}).describe("CreatePlantInput");

export const UpdatePlantSchema = PlantSchema.pick({
  status: true,
  lastWatered: true,
})
  .partial()
  .describe("UpdatePlantInput");

export const PlantResponseSchema = z
  .object({
    data: PlantSchema,
    message: z.string().describe("Success message"),
  })
  .describe("PlantResponse");

export const PlantListResponseSchema = z
  .object({
    data: z.array(PlantSchema),
    message: z.string().describe("Success message"),
  })
  .describe("PlantListResponse");

export type PlantStatus = z.infer<typeof PlantStatusSchema>;
export type Plant = z.infer<typeof PlantSchema>;
export type CreatePlantInput = z.infer<typeof CreatePlantSchema>;
export type UpdatePlantInput = z.infer<typeof UpdatePlantSchema>;

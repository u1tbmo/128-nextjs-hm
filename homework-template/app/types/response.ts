import { z } from "zod";

export const MessageResponseSchema = z
  .object({
    message: z.string().describe("Success message"),
  })
  .describe("MessageResponse");

export const ErrorResponseSchema = z
  .object({
    error: z.string().describe("Error message"),
  })
  .describe("ErrorResponse");

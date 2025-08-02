// schemas/classSchema.ts
import { z } from "zod";

// Zod Schema for Class Form Validation
export const classSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  schedule_info: z.string().min(10, "Schedule info must be at least 10 characters"),
  chat_ids: z.string().min(1, "At least one plan should be selected"),
});

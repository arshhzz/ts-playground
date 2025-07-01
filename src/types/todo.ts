import {z} from "zod";

export const todoSchema = z.object({
  title : z.string().min(2), 
  description : z.string().optional(), 
  done : z.boolean(), 
  userId: z.number().min(1)
});

export type todoPayload = z.infer<typeof todoSchema>
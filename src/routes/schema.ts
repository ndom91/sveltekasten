import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  url: z.string().url().min(3).max(100),
  description: z.string().min(3).max(500),
  category: z.string().min(2).max(50),
  tags: z.array(z.string().min(2).max(50)),
});

export type FormSchema = typeof formSchema;

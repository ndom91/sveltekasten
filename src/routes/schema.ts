import { z } from "zod";

export const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" }
] as const;

type Language = (typeof languages)[number]["value"];

export const formSchema = z.object({
  title: z.string({ required_error: "A title is required" }).min(2).max(100),
  url: z.string().url().max(100),
  description: z.string().min(3).max(500).optional(),
  category: z.string().min(2).max(50).optional(),
  // tags: z.array(z.string().min(2).max(50)).optional(),
  tags: z.enum(
    languages.map((f) => f.value) as [Language, ...Language[]],
    {
      errorMap: () => ({ message: "Please select a valid language." })
    }
  ).optional()
});

export type FormSchema = typeof formSchema;

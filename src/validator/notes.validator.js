import z from "zod";

export const createSchema = z.object({
  title: z.string().min(3, "Title must constain at least 3 characters"),
  body: z.string().min(10, "The body must contain at least 10 characters"),
});

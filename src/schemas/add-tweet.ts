import { z } from "zod";

export const addTweetSchema = z.object({
  body: z.string({ message: "Campo de texto vazio." }),
  answerOf: z.string().optional(),
});

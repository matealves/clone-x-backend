import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Preencha no mínimo 2 caracteres.").optional(),
  lastName: z.string().min(2, "Preencha no mínimo 2 caracteres.").optional(),
  bio: z.string().optional(),
  link: z.string().url("URL inválida.").optional(),
});

import { z } from "zod";

export const searchSchema = z.object({
  q: z
    .string({ message: "Campo de busca vazio." })
    .min(2, "Preencha no mínimo 2 caracteres."),
  page: z.coerce.number().min(0).optional(),
});

import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string({ message: "Esse campo é obrigatório." })
    .email("E-mail inválido."),
  password: z
    .string({ message: "Esse campo é obrigatório." })
    .min(4, "Preencha no mínimo 4 caracteres."),
});

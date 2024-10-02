import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ message: "Esse campo é obrigatório." })
    .min(2, "Preencha no mínimo 2 caracteres."),
  lastName: z
    .string({ message: "Esse campo é obrigatório." })
    .min(2, "Preencha no mínimo 2 caracteres."),
  email: z
    .string({ message: "Esse campo é obrigatório." })
    .email("E-mail inválido."),
  password: z
    .string({ message: "Esse campo é obrigatório." })
    .min(4, "Preencha no mínimo 4 caracteres."),
});

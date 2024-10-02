import { Request, Response } from "express";
import { signupSchema } from "../schemas/signup";

export const signup = (req: Request, res: Response) => {
  // validate the received data
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  // check email
  // check username
  // generate password hash
  // create user
  // create token
  // returns the result (token, user)

  res.json({ status: true });
};

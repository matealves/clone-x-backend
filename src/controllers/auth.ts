import { Request, Response } from "express";
import { signupSchema } from "../schemas/signup";
import { findUserByEmail, findUserByUsername } from "../services/user";
import slug from "slug";

export const signup = async (req: Request, res: Response) => {
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  // check email
  const hasEmail = await findUserByEmail(safeData.data.email);
  if (hasEmail) {
    res.json({ error: "E-mail já existe" });
    return;
  }

  // check username
  let genSlug = true;
  let userSlug = slug(`${safeData.data.name} ${safeData.data.lastName}`);

  while (genSlug) {
    const hasSlug = await findUserByUsername(userSlug);

    if (hasSlug) {
      let slugSuffix = Math.floor(Math.random() * 999999).toString();
      userSlug = slug(
        `${safeData.data.name} ${safeData.data.lastName}${slugSuffix}`
      );
    } else {
      genSlug = false;
    }
  }

  // generate password hash
  // create user
  // create token
  // returns the result (token, user)

  res.json({ status: true });
};

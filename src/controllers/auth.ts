import { Request, Response } from "express";
import { signupSchema } from "../schemas/signup";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../services/user";
import slug from "slug";
import { hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";

export const signup = async (req: Request, res: Response) => {
  // validate received data
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const { name, lastName, email, password } = safeData.data;

  // check email
  const hasEmail = await findUserByEmail(email);
  if (hasEmail) {
    res.json({ error: "E-mail já existe" });
    return;
  }

  // check username
  let genSlug = true;
  let userSlug = slug(`${name} ${lastName}`);

  while (genSlug) {
    const hasSlug = await findUserByUsername(userSlug);

    if (hasSlug) {
      let slugSuffix = Math.floor(Math.random() * 999999).toString();
      userSlug = slug(`${name} ${lastName}${slugSuffix}`);
    } else {
      genSlug = false;
    }
  }

  // generate password hash
  const hashPassword = await hash(password, 10);

  // create user
  const newUser = await createUser({
    username: userSlug,
    name,
    lastName,
    email,
    password: hashPassword,
  });

  // create token
  const token = createJWT(userSlug);

  // returns the result (token, user)
  res.status(201).json({
    token,
    user: {
      name: newUser.name,
      lastName: newUser.lastName,
      username: newUser.username,
      avatar: newUser.avatar,
    },
  });
};

import { RequestHandler } from "express";
import { signupSchema } from "../schemas/signup";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";

export const signup: RequestHandler = async (req, res) => {
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const { name, lastName, email, password } = safeData.data;

  const hasEmail = await findUserByEmail(email);
  if (hasEmail) {
    res.json({ error: "E-mail já existe" });
    return;
  }

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

  const hashPassword = await hash(password, 10);

  const newUser = await createUser({
    username: userSlug,
    name,
    lastName,
    email,
    password: hashPassword,
  });

  const token = createJWT(userSlug);

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

export const signin: RequestHandler = async (req, res) => {
  const safeData = signinSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = safeData.data;

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: "Acesso negado!" });
    return;
  }

  const verifyPassword = await compare(password, user.password);
  if (!verifyPassword) {
    res.status(401).json({ error: "Acesso negado!" });
    return;
  }

  const token = createJWT(user.username);

  res.json({
    token,
    user: {
      name: user.name,
      lastName: user.lastName,
      username: user.username,
      avatar: user.avatar,
    },
  });
};

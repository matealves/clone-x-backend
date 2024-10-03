import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "../services/user";
import { ExtendedRequest } from "../types/extended-request";

export const verifyJWT = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Não autorizado." });

  const [authType, token] = authorization.split(" ");

  if (authType !== "Bearer" || !token)
    return res.status(401).json({ error: "Não autorizado." });

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (error, decoded: any) => {
      if (error) return res.status(401).json({ error: "Não autorizado." });

      const user = await findUserByUsername(decoded.username);
      if (!user) return res.status(401).json({ error: "Não autorizado." });

      req.username = user.username;
      next();
    }
  );
};

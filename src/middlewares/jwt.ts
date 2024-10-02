import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "../services/user";
import { ExtendedRequest } from "../types/extended-request";

export const verifyJWT = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).json({ error: "Não autorizado." });
    return;
  }

  const [authType, token] = authorization.split(" ");

  if (authType === "Bearer" && token) {
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
  } else {
    res.status(401).json({ error: "Não autorizado." });
  }
};

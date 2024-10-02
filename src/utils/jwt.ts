import jwt from "jsonwebtoken";

export const createJWT = (username: string) => {
  return jwt.sign({ username }, process.env.JWT_SECRET as string);
};

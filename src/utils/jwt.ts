import jwt from "jsonwebtoken";

export const createToken = (username: string) => {
  return jwt.sign({ username }, process.env.JWT_SECRET as string);
};

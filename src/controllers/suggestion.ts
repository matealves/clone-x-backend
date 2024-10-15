import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getUserSuggestions } from "../services/user";

export const getSuggestions = async (req: ExtendedRequest, res: Response) => {
  const username = req.username as string;
  const suggestions = await getUserSuggestions(username);

  res.json({ users: suggestions });
};

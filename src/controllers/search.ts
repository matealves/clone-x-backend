import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { searchSchema } from "../schemas/search";
import { findTweetsByBody } from "../services/tweet";

export const searchTweets = async (req: ExtendedRequest, res: Response) => {
  const safeData = searchSchema.safeParse(req.query);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  const { page, q } = safeData.data;
  const perPage = 10;
  const currentPage = page ?? 0;

  const tweets = await findTweetsByBody(q, currentPage, perPage);

  res.json({ page: currentPage, tweets });
};

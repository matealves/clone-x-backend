import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import {
  findUserByUsername,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
} from "../services/user";
import { userInfo } from "os";
import { userTweetsSchema } from "../schemas/user-tweets";
import { findTweetsByUser } from "../services/tweet";

export const getUser = async (req: ExtendedRequest, res: Response) => {
  const { username } = req.params;
  const user = await findUserByUsername(username);

  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

  const following = await getUserFollowingCount(username);
  const followers = await getUserFollowersCount(username);
  const tweets = await getUserTweetCount(username);

  res.json({ user, following, followers, tweets });
};

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
  const safeData = userTweetsSchema.safeParse(req.query);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  const { username } = req.params;
  const { page } = safeData.data;

  const perPage = 10;
  const currentPage = page ?? 0;

  const tweets = await findTweetsByUser(username, currentPage, perPage);

  res.json({ page: currentPage, tweets });
};

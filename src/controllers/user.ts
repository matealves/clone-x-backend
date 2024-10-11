import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import {
  findUserByUsername,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
} from "../services/user";

export const getUser = async (req: ExtendedRequest, res: Response) => {
  const { username } = req.params;
  const user = await findUserByUsername(username);

  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

  const following = await getUserFollowingCount(username);
  const followers = await getUserFollowersCount(username);
  const tweets = await getUserTweetCount(username);

  res.json({ user, following, followers, tweets });
};

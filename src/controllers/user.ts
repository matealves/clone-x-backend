import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import {
  checkIfFollows,
  findAllUsers,
  findUserByUsername,
  follow,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
  unfollow,
} from "../services/user";
import { userTweetsSchema } from "../schemas/user-tweets";
import { findTweetsByUser } from "../services/tweet";

export const getUsers = async (req: ExtendedRequest, res: Response) => {
  const users = await findAllUsers();
  res.json({ users });
};

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

export const followToggle = async (req: ExtendedRequest, res: Response) => {
  const { username } = req.params;
  const userLogged = req.username as string;

  const hasUserToBeFollowed = await findUserByUsername(username);
  if (!hasUserToBeFollowed)
    return res.status(404).json({ error: "Usuário não encontrado." });

  if (userLogged === username)
    return res.status(400).json({ error: "Não é possível seguir você mesmo." });

  const follows = await checkIfFollows(userLogged, username);

  if (!follows) {
    follow(userLogged, username);
    res.json({ following: true });
  } else {
    unfollow(userLogged, username);
    res.json({ following: false });
  }
};

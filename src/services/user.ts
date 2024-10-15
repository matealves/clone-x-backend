import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { getPublicURL } from "../utils/url";

export const findAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      username: true,
      name: true,
      lastName: true,
      email: true,
      avatar: true,
      cover: true,
      bio: true,
      link: true,
      createdAt: true,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (user) {
    return {
      ...user,
      avatar: getPublicURL(user.avatar),
      cover: getPublicURL(user.cover),
    };
  }

  return null;
};

export const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findFirst({
    select: {
      avatar: true,
      cover: true,
      username: true,
      name: true,
      lastName: true,
      bio: true,
      link: true,
    },
    where: { username },
  });

  if (user) {
    return {
      ...user,
      avatar: getPublicURL(user.avatar),
      cover: getPublicURL(user.cover),
    };
  }

  return null;
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  const newUser = await prisma.user.create({ data });

  return {
    ...newUser,
    avatar: getPublicURL(newUser.avatar),
    cover: getPublicURL(newUser.cover),
  };
};

export const getUserFollowingCount = async (username: string) => {
  return await prisma.follow.count({
    where: { user: username },
  });
};

export const getUserFollowersCount = async (username: string) => {
  return await prisma.follow.count({
    where: { followedUser: username },
  });
};

export const getUserTweetCount = async (username: string) => {
  return await prisma.tweet.count({
    where: { userId: username },
  });
};

export const checkIfFollows = async (username: string, username2: string) => {
  const follows = await prisma.follow.findFirst({
    where: { user: username, followedUser: username2 },
  });

  return !!follows;
};

export const follow = async (username: string, username2: string) => {
  await prisma.follow.create({
    data: { user: username, followedUser: username2 },
  });
};

export const unfollow = async (username: string, username2: string) => {
  await prisma.follow.deleteMany({
    where: { user: username, followedUser: username2 },
  });
};

export const updateUserInfo = async (
  username: string,
  data: Prisma.UserUpdateInput
) => {
  await prisma.user.update({
    where: { username },
    data,
  });
};

export const getUserFollowing = async (username: string) => {
  const following = [];
  const reqFollow = await prisma.follow.findMany({
    select: { followedUser: true },
    where: { user: username },
  });

  for (let reqItem of reqFollow) {
    following.push(reqItem.followedUser);
  }

  return following;
};

export const getUserSuggestions = async (username: string) => {
  const following = await getUserFollowing(username);
  const followingPlusMe = [...following, username];

  console.log("following:", following);
  console.log("Prisma.join:", Prisma.join(followingPlusMe));

  type Suggestion = Pick<
    Prisma.UserGetPayload<Prisma.UserDefaultArgs>,
    "name" | "lastName" | "avatar" | "username"
  >;

  const suggestions: Suggestion[] = await prisma.$queryRaw`
  SELECT name, "lastName", avatar, username
    FROM "User"
    WHERE username NOT IN (${Prisma.join(followingPlusMe)})
    ORDER BY RANDOM()
    LIMIT 2;
  `;

  for (let sugIndex in suggestions) {
    suggestions[sugIndex].avatar = getPublicURL(suggestions[sugIndex].avatar);
  }

  return suggestions;
};

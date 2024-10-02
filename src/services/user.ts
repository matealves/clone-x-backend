import { prisma } from "../utils/prisma";
import { getPublicURL } from "../utils/url";

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

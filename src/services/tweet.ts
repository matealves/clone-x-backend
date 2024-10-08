import { prisma } from "../utils/prisma";
import { getPublicURL } from "../utils/url";

export const findTweet = async (id: number) => {
  const tweet = await prisma.tweet.findFirst({
    include: {
      user: {
        select: {
          name: true,
          lastName: true,
          avatar: true,
          username: true,
        },
      },
      likes: { select: { userId: true } },
    },
    where: { id },
  });

  if (!tweet) return null;

  tweet.user.avatar = getPublicURL(tweet.user.avatar);
  return tweet;
};

export const createTweet = async (
  username: string,
  body: string,
  answer?: number
) => {
  return await prisma.tweet.create({
    data: {
      body,
      userId: username,
      answerOf: answer ?? 0,
    },
  });
};

export const findAnswersFromTweet = async (id: number) => {
  const tweets = await prisma.tweet.findMany({
    include: {
      user: {
        select: {
          name: true,
          lastName: true,
          avatar: true,
          username: true,
        },
      },
      likes: { select: { userId: true } },
    },
    where: { answerOf: id },
  });

  for (let tweetIndex in tweets) {
    tweets[tweetIndex].user.avatar = getPublicURL(
      tweets[tweetIndex].user.avatar
    );
  }

  return tweets;
};

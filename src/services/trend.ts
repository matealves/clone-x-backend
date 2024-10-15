import { prisma } from "../utils/prisma";

export const addHashtag = async (hashtag: string) => {
  const hs = await prisma.trend.findFirst({
    where: { hashtag },
  });

  if (hs) {
    await prisma.trend.update({
      where: { id: hs.id },
      data: { count: hs.count + 1, updatedAt: new Date() },
    });
  } else {
    await prisma.trend.create({
      data: { hashtag },
    });
  }
};

export const getTrending = async () => {
  return await prisma.trend.findMany({
    select: { hashtag: true, count: true },
    orderBy: { count: "desc" },
    take: 4,
  });
};

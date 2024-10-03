import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { createTweet, findTweet } from "../services/tweet";
import { addHashtag } from "../services/trend";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
  const safeData = addTweetSchema.safeParse(req.body);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  const { answerOf, body } = safeData.data;

  if (answerOf) {
    const hasAnswerTweet = await findTweet(parseInt(answerOf));
    if (!hasAnswerTweet) {
      return res.json({ error: "Tweet original não encontrado." });
    }
  }

  const newTweet = await createTweet(
    req.username as string,
    body,
    answerOf ? parseInt(answerOf) : 0
  );

  const hashtags = body.match(/#[a-zA-Z0-9_]+/g);

  if (hashtags) {
    for (let hashtag of hashtags) {
      if (hashtag.length >= 2) {
        await addHashtag(hashtag);
      }
    }
  }

  res.json({ tweet: newTweet });
};

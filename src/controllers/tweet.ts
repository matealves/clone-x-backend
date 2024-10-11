import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import {
  checkIfTweetIsLikedByUser,
  createTweet,
  findAnswersFromTweet,
  findTweet,
  likeTweet,
  unlikeTweet,
} from "../services/tweet";
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
      return res.status(404).json({ error: "Tweet original não encontrado." });
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

export const getTweet = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const tweet = await findTweet(parseInt(id));

  if (!tweet) {
    return res.status(404).json({ error: "Tweet não encontrado." });
  }

  res.json({ tweet });
};

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const answers = await findAnswersFromTweet(parseInt(id));

  if (!answers) {
    return res.status(404).json({ error: "Tweet não encontrado." });
  }

  res.json({ answers });
};

export const likeToggle = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;
  const liked = await checkIfTweetIsLikedByUser(
    req.username as string,
    parseInt(id)
  );

  if (!liked) {
    likeTweet(req.username as string, parseInt(id));
    res.json({ like: true });
  } else {
    unlikeTweet(req.username as string, parseInt(id));
    res.json({ action: false });
  }
};

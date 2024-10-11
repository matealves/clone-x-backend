import { Router } from "express";
import { verifyToken } from "../middlewares/jwt";

import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as tweetController from "../controllers/tweet";
import * as userController from "../controllers/user";

export const router = Router();

// test
router.get("/ping", pingController.ping);
router.get("/privateping", verifyToken, pingController.privatePing);

// auth
router.post("/auth/signup", authController.signup);
router.post("/auth/signin", authController.signin);

// tweet
router.post("/tweet", verifyToken, tweetController.addTweet);
router.get("/tweet/:id", verifyToken, tweetController.getTweet);
router.get("/tweet/:id/answers", verifyToken, tweetController.getAnswers);
router.post("/tweet/:id/like", verifyToken, tweetController.likeToggle);

// user
router.get("/user/", userController.getUsers);
router.get("/user/:username", verifyToken, userController.getUser);
router.get("/user/:username/tweets", verifyToken, userController.getUserTweets);
router.post("/user/:username/follow", verifyToken, userController.followToggle);
// router.put("/user");
// router.put("/user/avatar");
// router.put("/user/cover");

// general
// router.get("/feed");
// router.get("/search");
// router.get("/trending");
// router.get("/suggestions");

import { Router } from "express";
import { verifyToken } from "../middlewares/jwt";

import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as tweetController from "../controllers/tweet";

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
// mainRouter.get("/tweet/:id/answers");
// mainRouter.post("/tweet/:id/like");

// user
// mainRouter.get("/user/:username");
// mainRouter.get("/user/:username/tweets");
// mainRouter.post("/user/:username/follow");
// mainRouter.put("/user");
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

// general
// mainRouter.get("/feed");
// mainRouter.get("/search");
// mainRouter.get("/trending");
// mainRouter.get("/suggestions");

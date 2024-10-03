import { Router } from "express";
import { verifyToken } from "../middlewares/jwt";

import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as tweetController from "../controllers/tweet";

export const mainRouter = Router();

// test
mainRouter.get("/ping", pingController.ping);
mainRouter.get("/privateping", verifyToken, pingController.privatePing);

// auth
mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/signin", authController.signin);

// tweet
mainRouter.post("/tweet", verifyToken, tweetController.addTweet);
// mainRouter.get("/tweet/:id");
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

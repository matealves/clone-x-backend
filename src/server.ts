import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";

import { mainRouter } from "./routers/main.routes";

const server = express();
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL;

server.use(helmet());
server.use(cors());
server.use(urlencoded({ extended: true }));
server.use(express.json());

// routes
server.use(mainRouter);

server.listen(PORT, () => {
  console.log(`[PORT:${PORT}] \x1b[32mServer running on \x1b[0m${BASE_URL}`);
});

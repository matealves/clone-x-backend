import { Request } from "express";

export type ExtendedRequest = Request & {
  username?: string;
};

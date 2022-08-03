import { Router } from "express";

import { postShortUrl, getUrlById, redirectToUrl, deleteUrl } from "../controllers/urlsController.js";

import { jwtAuth } from "../middlewares/jwtAuthMidd.js"

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", jwtAuth, postShortUrl);
urlsRouter.get("/urls/:id", getUrlById);
urlsRouter.get("/urls/open/:shortUrl",redirectToUrl);
urlsRouter.delete("/urls/:id",jwtAuth, deleteUrl);

export default urlsRouter;
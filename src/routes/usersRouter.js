import { Router } from "express";

import { getUserInfo } from "../controllers/userController.js";

import { jwtAuth } from "../middlewares/jwtAuthMidd.js"

const usersRouter = Router();

usersRouter.get("/users/me",jwtAuth,getUserInfo);

export default usersRouter;
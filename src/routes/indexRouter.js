import { Router } from "express";

import authRouter from "./authRouter.js";
import urlsRouter from "./urlsRouter.js";
import usersRouter from "./usersRouter.js";
import rankingRouter from "./rankingRouter.js";

const router = Router()
router.use([authRouter,urlsRouter,usersRouter,rankingRouter])
export default router;
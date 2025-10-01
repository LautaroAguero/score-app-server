import { Router } from "express";
import userRouter from "../../modules/user/userRouter.js";
import tournamentRouter from "../../modules/tournament/tournamentRouter.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("API v1 running");
});

router.use("/user", userRouter);
router.use("/tournaments", tournamentRouter);

export default router;

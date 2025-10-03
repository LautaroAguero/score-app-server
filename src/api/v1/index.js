import { Router } from "express";
import userRouter from "../../modules/user/userRouter.js";
import tournamentRouter from "../../modules/tournament/tournamentRouter.js";
import teamRouter from "../../modules/team/teamRouter.js";
import matchRouter from "../../modules/match/matchRouter.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("API v1 running");
});

router.use("/user", userRouter);
router.use("/tournaments", tournamentRouter);
router.use("/teams", teamRouter);
router.use("/matches", matchRouter);

export default router;

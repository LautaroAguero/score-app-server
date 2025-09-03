import { Router } from "express";
import userRouter from "../../modules/user/userRouter.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("API v1 running");
});

router.use("/user", userRouter);

export default router;

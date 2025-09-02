import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("API v1 running");
});

export default router;

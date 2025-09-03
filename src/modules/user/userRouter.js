import express from "express";
import { login, register, verifyToken } from "./userController.js";
import { auth } from "../../middlewares/authentication.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify", auth, verifyToken);

export default router;

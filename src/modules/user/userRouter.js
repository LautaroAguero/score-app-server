import express from "express";
import { login, register, verifyToken } from "./userController.js";
import { auth } from "../../middlewares/authentication.js";
import { validateRequest } from "../../core/validation/validateRequest.js";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../../core/validation/schemas.js";

const router = express.Router();

router.post("/login", validateRequest(userLoginSchema), login);
router.post("/register", validateRequest(userRegisterSchema), register);
router.post("/verify", auth, verifyToken);

export default router;

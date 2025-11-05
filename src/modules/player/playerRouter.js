import express from "express";
import {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
} from "./playerController.js";
import { auth } from "../../middlewares/authentication.js";
import { validateRequest } from "../../core/validation/validateRequest.js";
import {
  playerCreateSchema,
  playerUpdateSchema,
} from "../../core/validation/schemas.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllPlayers); // Public - get all players or filter by team (?team=id)
router.get("/:id", getPlayerById); // Public - get single player

// Protected routes (authentication required)
router.post("/", auth, validateRequest(playerCreateSchema), createPlayer);
router.put("/:id", auth, validateRequest(playerUpdateSchema), updatePlayer);
router.delete("/:id", auth, deletePlayer);

export default router;

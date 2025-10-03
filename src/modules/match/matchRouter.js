import express from "express";
import {
  createMatch,
  getAllMatches,
  getMatchesByTournament,
  getMatchById,
  updateMatch,
  deleteMatch,
} from "./matchController.js";
import { auth } from "../../middlewares/authentication.js";

const router = express.Router();

// Public routes (no authentication required)
// IMPORTANT: Specific routes MUST come before parameterized routes
router.get("/", getAllMatches); // Public - get all matches or filter by tournament (?tournament=id)
router.get("/tournament/:tournamentId", getMatchesByTournament); // Public - get matches by tournament ID
router.get("/:id", getMatchById); // Public - get single match (must be AFTER /tournament/:tournamentId)

// Protected routes (authentication required)
router.post("/", auth, createMatch);
router.put("/:id", auth, updateMatch);
router.delete("/:id", auth, deleteMatch);

export default router;

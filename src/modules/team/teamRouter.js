import express from "express";
import {
  createTeam,
  getAllTeams,
  getTeamsByTournament,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "./teamController.js";
import { auth } from "../../middlewares/authentication.js";
import { upload } from "../../config/upload.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllTeams); // Public - get all teams or filter by tournament (?tournament=id)

// Protected routes (authentication required)
router.post("/", auth, upload.single("teamLogo"), createTeam);
router.get("/tournament/:tournamentId", getTeamsByTournament);
router.get("/:id", getTeamById);
router.put("/:id", auth, upload.single("teamLogo"), updateTeam);
router.delete("/:id", auth, deleteTeam);

export default router;

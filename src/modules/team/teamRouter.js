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

// All team routes require authentication
router.post("/", auth, upload.single("teamLogo"), createTeam);
router.get("/", auth, getAllTeams);
router.get("/tournament/:tournamentId", auth, getTeamsByTournament);
router.get("/:id", auth, getTeamById);
router.put("/:id", auth, upload.single("teamLogo"), updateTeam);
router.delete("/:id", auth, deleteTeam);

export default router;

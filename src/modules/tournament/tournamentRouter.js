import express from "express";
import {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  getMyTournaments,
  getTournamentStandings,
} from "./tournamentController.js";
import { auth } from "../../middlewares/authentication.js";
import { upload } from "../../config/upload.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllTournaments); // Public - get all tournaments

// Protected routes (authentication required)
router.post("/", auth, upload.single("tournamentBanner"), createTournament);
router.get("/my-tournaments", auth, getMyTournaments);
router.get("/:id/standings", getTournamentStandings); // Public - get tournament standings
router.get("/:id", getTournamentById); // Public - get single tournament
router.put("/:id", auth, upload.single("tournamentBanner"), updateTournament);
router.delete("/:id", auth, deleteTournament);

export default router;

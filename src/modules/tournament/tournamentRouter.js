import express from "express";
import {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  getMyTournaments,
} from "./tournamentController.js";
import { auth } from "../../middlewares/authentication.js";
import { upload } from "../../config/upload.js";

const router = express.Router();

// All tournament routes require authentication
router.post("/", auth, upload.single("tournamentBanner"), createTournament);
router.get("/", auth, getAllTournaments);
router.get("/my-tournaments", auth, getMyTournaments);
router.get("/:id", auth, getTournamentById);
router.put("/:id", auth, upload.single("tournamentBanner"), updateTournament);
router.delete("/:id", auth, deleteTournament);

export default router;

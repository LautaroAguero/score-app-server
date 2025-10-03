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

// All match routes require authentication
router.post("/", auth, createMatch);
router.get("/", auth, getAllMatches);
router.get("/tournament/:tournamentId", auth, getMatchesByTournament);
router.get("/:id", auth, getMatchById);
router.patch("/:id", auth, updateMatch);
router.delete("/:id", auth, deleteMatch);

export default router;

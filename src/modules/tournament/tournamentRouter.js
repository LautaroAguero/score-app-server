import express from "express";
import {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  getMyTournaments,
  getTournamentStandings,
  addTeamsToTournament,
  autoGenerateMatches,
  getSetupStatus,
} from "./tournamentController.js";
import { auth } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorization.js";
import { upload } from "../../config/upload.js";
import { validateRequest } from "../../core/validation/validateRequest.js";
import {
  tournamentCreateSchema,
  tournamentUpdateSchema,
  addTeamsSchema,
  autoGenerateMatchesSchema,
} from "../../core/validation/schemas.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllTournaments); // Public - get all tournaments

// Protected routes (authentication required)
router.post(
  "/",
  auth,
  authorize("organizer", "admin"),
  validateRequest(tournamentCreateSchema),
  upload.single("tournamentBanner"),
  createTournament
);
router.get("/my-tournaments", auth, getMyTournaments);
router.get("/:id/standings", getTournamentStandings); // Public - get tournament standings
router.get("/:id", getTournamentById); // Public - get single tournament
router.put(
  "/:id",
  auth,
  authorize("organizer", "admin"),
  validateRequest(tournamentUpdateSchema),
  upload.single("tournamentBanner"),
  updateTournament
);
router.post(
  "/:id/add-teams",
  auth,
  authorize("organizer", "admin"),
  validateRequest(addTeamsSchema),
  addTeamsToTournament
);
router.post(
  "/:id/auto-generate-matches",
  auth,
  authorize("organizer", "admin"),
  validateRequest(autoGenerateMatchesSchema),
  autoGenerateMatches
);
router.get("/:id/setup-status", getSetupStatus); // Public - get tournament setup status
router.delete("/:id", auth, authorize("organizer", "admin"), deleteTournament);

export default router;

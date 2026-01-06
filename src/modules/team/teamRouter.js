import express from "express";
import {
  createTeam,
  getAllTeams,
  getMyTeams,
  getTeamsByTournament,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "./teamController.js";
import { auth } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorization.js";
import { upload } from "../../config/upload.js";
import { validateRequest } from "../../core/validation/validateRequest.js";
import {
  teamCreateSchema,
  teamUpdateSchema,
} from "../../core/validation/schemas.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllTeams); // Public - get all teams or filter by tournament (?tournament=id)

// Protected routes (authentication required)
// Get my teams - teams created by the logged user (for team captains to select)
router.get("/my-teams", auth, getMyTeams);
// Only "user", "organizer", and "admin" can create teams
router.post(
  "/",
  auth,
  authorize("user", "organizer", "admin"),
  validateRequest(teamCreateSchema),
  upload.single("teamLogo"),
  createTeam
);
router.get("/tournament/:tournamentId", getTeamsByTournament);
router.get("/:id", getTeamById);
router.put(
  "/:id",
  auth,
  authorize("user", "organizer", "admin"),
  validateRequest(teamUpdateSchema),
  upload.single("teamLogo"),
  updateTeam
);
router.delete(
  "/:id",
  auth,
  authorize("user", "organizer", "admin"),
  deleteTeam
);

export default router;

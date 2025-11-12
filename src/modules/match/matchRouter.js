import express from "express";
import {
  createMatch,
  getAllMatches,
  getMatchesByTournament,
  getMatchById,
  updateMatch,
  deleteMatch,
  bulkScheduleMatches,
} from "./matchController.js";
import { auth } from "../../middlewares/authentication.js";
import { validateRequest } from "../../core/validation/validateRequest.js";
import {
  matchCreateSchema,
  matchUpdateSchema,
  bulkScheduleMatchesSchema,
} from "../../core/validation/schemas.js";

const router = express.Router();

// Public routes (no authentication required)
// IMPORTANT: Specific routes MUST come before parameterized routes
router.get("/", getAllMatches); // Public - get all matches or filter by tournament (?tournament=id)
router.get("/tournament/:tournamentId", getMatchesByTournament); // Public - get matches by tournament ID
router.get("/:id", getMatchById); // Public - get single match (must be AFTER /tournament/:tournamentId)

// Protected routes (authentication required)
router.post("/", auth, validateRequest(matchCreateSchema), createMatch);
router.put("/:id", auth, validateRequest(matchUpdateSchema), updateMatch);
router.patch(
  "/bulk-schedule",
  auth,
  validateRequest(bulkScheduleMatchesSchema),
  bulkScheduleMatches
);
router.delete("/:id", auth, deleteMatch);

export default router;

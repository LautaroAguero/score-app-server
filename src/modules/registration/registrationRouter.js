import express from "express";
import {
  registerTeam,
  getRegistrationsByTournament,
  getMyRegistrations,
  getRegistrationById,
  approveRegistration,
  rejectRegistration,
  cancelRegistration,
  getTournamentRegistrationStats,
  getAllRegistrationsGroupedByTournament,
  getApprovedRegistrationsGroupedByTournament,
} from "./registrationController.js";
import { auth } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorization.js";
import { validateRequest } from "../../core/validation/validateRequest.js";
import {
  registrationCreateSchema,
  registrationUpdateSchema,
} from "../../core/validation/schemas.js";

const router = express.Router();

// Protected routes (authentication required for all registration endpoints)

// Register a team to a tournament - users can register their teams
router.post(
  "/",
  auth,
  authorize("user", "organizer", "admin"),
  validateRequest(registrationCreateSchema),
  registerTeam
);

// Get my registrations - all authenticated users
router.get("/my-registrations", auth, getMyRegistrations);

// Get all registrations grouped by tournament (admin/organizer only)
router.get(
  "/grouped/by-tournament",
  auth,
  authorize("organizer", "admin"),
  getAllRegistrationsGroupedByTournament
);

// Get only approved registrations grouped by tournament (for approved teams list)
router.get(
  "/approved/by-tournament",
  auth,
  authorize("organizer", "admin"),
  getApprovedRegistrationsGroupedByTournament
);

// Get tournament registration stats (only organizer/admin can access)
router.get(
  "/tournament/:tournamentId/stats",
  auth,
  authorize("organizer", "admin"),
  getTournamentRegistrationStats
);

// Get registrations for a tournament (public - any authenticated user can view)
router.get("/tournament/:tournamentId", getRegistrationsByTournament);

// Get a single registration by ID
router.get("/:id", getRegistrationById);

// Approve a registration (only organizer/admin can do this)
router.patch(
  "/:id/approve",
  auth,
  authorize("organizer", "admin"),
  approveRegistration
);

// Reject a registration (only organizer/admin can do this)
router.patch(
  "/:id/reject",
  auth,
  authorize("organizer", "admin"),
  validateRequest(registrationUpdateSchema),
  rejectRegistration
);

// Cancel a registration - any authenticated user can cancel their own
router.delete(
  "/:id",
  auth,
  authorize("user", "organizer", "admin"),
  cancelRegistration
);

export default router;

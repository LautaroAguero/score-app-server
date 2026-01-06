import { RegistrationService } from "./registrationService.js";

const registrationService = new RegistrationService();

// Register a team to a tournament
export const registerTeam = async (req, res) => {
  try {
    const { tournament, team } = req.body;
    const userId = req.user.id;

    const registration = await registrationService.registerTeam(
      tournament,
      team,
      userId
    );

    res.status(201).json({ registration });
  } catch (err) {
    console.error("Error registering team:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get registrations for a tournament
export const getRegistrationsByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { status } = req.query;

    const registrations =
      await registrationService.getRegistrationsByTournament(
        tournamentId,
        status
      );

    res.status(200).json({ registrations });
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get my registrations
export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await registrationService.getMyRegistrations(userId);

    res.status(200).json({ registrations });
  } catch (err) {
    console.error("Error fetching my registrations:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await registrationService.getRegistrationById(id);

    res.status(200).json({ registration });
  } catch (err) {
    console.error("Error fetching registration:", err);
    res.status(404).json({ message: err.message });
  }
};

// Approve a registration
export const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const registration = await registrationService.approveRegistration(
      id,
      userId
    );

    res.status(200).json({ registration });
  } catch (err) {
    if (
      err.message ===
      "No tienes permiso para aprobar inscripciones de este torneo"
    ) {
      return res.status(403).json({ message: err.message });
    }
    console.error("Error approving registration:", err);
    res.status(400).json({ message: err.message });
  }
};

// Reject a registration
export const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const userId = req.user.id;

    const registration = await registrationService.rejectRegistration(
      id,
      userId,
      rejectionReason
    );

    res.status(200).json({ registration });
  } catch (err) {
    if (
      err.message ===
      "No tienes permiso para rechazar inscripciones de este torneo"
    ) {
      return res.status(403).json({ message: err.message });
    }
    console.error("Error rejecting registration:", err);
    res.status(400).json({ message: err.message });
  }
};

// Cancel a registration
export const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await registrationService.cancelRegistration(id, userId);

    res.status(200).json(result);
  } catch (err) {
    if (err.message === "No tienes permiso para cancelar esta inscripción") {
      return res.status(403).json({ message: err.message });
    }
    console.error("Error canceling registration:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get tournament registration stats
export const getTournamentRegistrationStats = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const userId = req.user.id;

    const stats = await registrationService.getTournamentRegistrationStats(
      tournamentId,
      userId
    );

    res.status(200).json(stats);
  } catch (err) {
    if (
      err.message ===
      "No tienes permiso para ver las estadísticas de este torneo"
    ) {
      return res.status(403).json({ message: err.message });
    }
    console.error("Error fetching stats:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all registrations grouped by tournament (admin only)
export const getAllRegistrationsGroupedByTournament = async (req, res) => {
  try {
    const data =
      await registrationService.getAllRegistrationsGroupedByTournament();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching grouped registrations:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get only approved registrations grouped by tournament (for approved teams list)
export const getApprovedRegistrationsGroupedByTournament = async (req, res) => {
  try {
    const data =
      await registrationService.getApprovedRegistrationsGroupedByTournament();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching approved registrations:", err);
    res.status(500).json({ message: err.message });
  }
};

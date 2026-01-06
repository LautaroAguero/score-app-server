import Registration from "./registrationModel.js";
import Tournament from "../tournament/tournamentModel.js";
import Team from "../team/teamModel.js";

export class RegistrationService {
  // Register a team to a tournament
  async registerTeam(tournamentId, teamId, userId) {
    // 1. Validate tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // 2. Validate team exists
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error("Equipo no encontrado");
    }

    // 3. Validate team doesn't already belong to a different tournament
    // (Teams can be created without tournament, or belong to one tournament)
    if (team.tournament && team.tournament.toString() !== tournamentId) {
      throw new Error("El equipo ya pertenece a otro torneo");
    }

    // 4. Check if registration period is open (if dates are set)
    const now = new Date();
    if (tournament.registrationStartDate && tournament.registrationEndDate) {
      if (now < tournament.registrationStartDate) {
        throw new Error("El período de inscripción aún no ha comenzado");
      }
      if (now > tournament.registrationEndDate) {
        throw new Error("El período de inscripción ha finalizado");
      }
    }

    // 5. Check if tournament has reached max teams limit
    if (tournament.maxTeams) {
      const approvedCount = await Registration.countDocuments({
        tournament: tournamentId,
        status: "approved",
      });
      if (approvedCount >= tournament.maxTeams) {
        throw new Error(
          "El torneo ha alcanzado el máximo de equipos permitidos"
        );
      }
    }

    // 6. Check for duplicate registration (prevent multiple registrations of same team)
    const existingRegistration = await Registration.findOne({
      tournament: tournamentId,
      team: teamId,
    });
    if (existingRegistration) {
      throw new Error("Este equipo ya está inscrito en el torneo");
    }

    // 7. Create registration - always starts as pending
    const registration = new Registration({
      tournament: tournamentId,
      team: teamId,
      user: userId,
      status: "pending",
      appliedAt: new Date(),
    });

    await registration.save();

    // 8. Populate and return
    await registration.populate([
      { path: "tournament", select: "name sportType" },
      { path: "team", select: "name teamLogo" },
      { path: "user", select: "name email" },
    ]);

    return {
      id: registration._id,
      tournament: registration.tournament,
      team: registration.team,
      user: registration.user,
      status: registration.status,
      appliedAt: registration.appliedAt,
      createdAt: registration.createdAt,
      updatedAt: registration.updatedAt,
    };
  }

  // Get registrations for a tournament
  async getRegistrationsByTournament(tournamentId, status = null) {
    const query = { tournament: tournamentId };

    if (status) {
      query.status = status;
    }

    const registrations = await Registration.find(query)
      .populate("team", "name teamLogo")
      .populate("user", "name email")
      .populate("approvedBy", "name email")
      .sort({ appliedAt: -1 });

    return registrations;
  }

  // Get registrations for a specific user
  async getMyRegistrations(userId) {
    const registrations = await Registration.find({ user: userId })
      .populate("tournament", "name sportType status")
      .populate("team", "name teamLogo")
      .sort({ appliedAt: -1 });

    return registrations;
  }

  // Get a single registration by ID
  async getRegistrationById(id) {
    const registration = await Registration.findById(id)
      .populate("tournament", "name sportType")
      .populate("team", "name teamLogo")
      .populate("user", "name email")
      .populate("approvedBy", "name email");

    if (!registration) {
      throw new Error("Inscripción no encontrada");
    }

    return registration;
  }

  // Approve a registration (only tournament creator can do this)
  async approveRegistration(registrationId, userId) {
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      throw new Error("Inscripción no encontrada");
    }

    // Verify tournament ownership
    const tournament = await Tournament.findById(registration.tournament);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    if (tournament.createdBy.toString() !== userId) {
      throw new Error(
        "No tienes permiso para aprobar inscripciones de este torneo"
      );
    }

    // Check max teams limit before approval
    if (tournament.maxTeams) {
      const approvedCount = await Registration.countDocuments({
        tournament: registration.tournament,
        status: "approved",
      });
      if (approvedCount >= tournament.maxTeams) {
        throw new Error(
          "El torneo ha alcanzado el máximo de equipos permitidos"
        );
      }
    }

    // Update registration
    registration.status = "approved";
    registration.approvedAt = new Date();
    registration.approvedBy = userId;

    await registration.save();

    // Associate team to tournament (update team document)
    await Team.findByIdAndUpdate(
      registration.team,
      { tournament: registration.tournament },
      { new: true }
    );

    await registration.populate([
      { path: "tournament", select: "name sportType" },
      { path: "team", select: "name teamLogo" },
      { path: "user", select: "name email" },
      { path: "approvedBy", select: "name email" },
    ]);

    return {
      id: registration._id,
      tournament: registration.tournament,
      team: registration.team,
      user: registration.user,
      status: registration.status,
      appliedAt: registration.appliedAt,
      approvedAt: registration.approvedAt,
      approvedBy: registration.approvedBy,
      createdAt: registration.createdAt,
      updatedAt: registration.updatedAt,
    };
  }

  // Reject a registration (only tournament creator can do this)
  async rejectRegistration(registrationId, userId, rejectionReason = null) {
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      throw new Error("Inscripción no encontrada");
    }

    // Verify tournament ownership
    const tournament = await Tournament.findById(registration.tournament);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    if (tournament.createdBy.toString() !== userId) {
      throw new Error(
        "No tienes permiso para rechazar inscripciones de este torneo"
      );
    }

    // Update registration
    registration.status = "rejected";
    registration.approvedAt = new Date();
    registration.approvedBy = userId;
    if (rejectionReason) {
      registration.rejectionReason = rejectionReason;
    }

    await registration.save();

    await registration.populate([
      { path: "tournament", select: "name sportType" },
      { path: "team", select: "name teamLogo" },
      { path: "user", select: "name email" },
      { path: "approvedBy", select: "name email" },
    ]);

    return {
      id: registration._id,
      tournament: registration.tournament,
      team: registration.team,
      user: registration.user,
      status: registration.status,
      appliedAt: registration.appliedAt,
      approvedAt: registration.approvedAt,
      approvedBy: registration.approvedBy,
      rejectionReason: registration.rejectionReason,
      createdAt: registration.createdAt,
      updatedAt: registration.updatedAt,
    };
  }

  // Cancel a registration (user who created it can cancel)
  async cancelRegistration(registrationId, userId) {
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      throw new Error("Inscripción no encontrada");
    }

    // Verify user owns this registration
    if (registration.user.toString() !== userId) {
      throw new Error("No tienes permiso para cancelar esta inscripción");
    }

    // Can only cancel if status is pending or approved
    if (registration.status === "rejected") {
      throw new Error("No puedes cancelar una inscripción rechazada");
    }

    // Delete the registration
    await Registration.findByIdAndDelete(registrationId);

    return {
      message: "Inscripción cancelada exitosamente",
      registrationId: registrationId,
    };
  }

  // Get tournament registration stats
  async getTournamentRegistrationStats(tournamentId, userId) {
    // Verify tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // Verify user is tournament creator
    if (tournament.createdBy.toString() !== userId) {
      throw new Error(
        "No tienes permiso para ver las estadísticas de este torneo"
      );
    }

    const total = await Registration.countDocuments({
      tournament: tournamentId,
    });

    const approved = await Registration.countDocuments({
      tournament: tournamentId,
      status: "approved",
    });

    const pending = await Registration.countDocuments({
      tournament: tournamentId,
      status: "pending",
    });

    const rejected = await Registration.countDocuments({
      tournament: tournamentId,
      status: "rejected",
    });

    return {
      tournament: {
        id: tournament._id,
        name: tournament.name,
        maxTeams: tournament.maxTeams,
        requiresApproval: tournament.requiresApproval,
      },
      stats: {
        total,
        approved,
        pending,
        rejected,
      },
    };
  }

  // Get all registrations grouped by tournament (for admin/organizers)
  async getAllRegistrationsGroupedByTournament() {
    const registrations = await Registration.find()
      .populate("tournament", "name sportType maxTeams requiresApproval")
      .populate("team", "name teamLogo")
      .populate("user", "name email")
      .sort({ tournament: 1, status: 1, appliedAt: -1 });

    // Group registrations by tournament
    const grouped = {};

    registrations.forEach((reg) => {
      const tournamentId = reg.tournament._id.toString();
      if (!grouped[tournamentId]) {
        grouped[tournamentId] = {
          tournament: reg.tournament,
          registrations: [],
        };
      }
      grouped[tournamentId].registrations.push({
        id: reg._id,
        team: reg.team,
        user: reg.user,
        status: reg.status,
        appliedAt: reg.appliedAt,
        approvedAt: reg.approvedAt,
        rejectionReason: reg.rejectionReason,
      });
    });

    return {
      registrations: Object.values(grouped),
    };
  }

  // Get approved registrations grouped by tournament (only status: approved)
  async getApprovedRegistrationsGroupedByTournament() {
    const registrations = await Registration.find({ status: "approved" })
      .populate("tournament", "name sportType maxTeams")
      .populate("team", "name teamLogo")
      .populate("user", "name email")
      .sort({ tournament: 1, approvedAt: -1 });

    // Group registrations by tournament
    const grouped = {};

    registrations.forEach((reg) => {
      const tournamentId = reg.tournament._id.toString();
      if (!grouped[tournamentId]) {
        grouped[tournamentId] = {
          tournament: reg.tournament,
          approvedTeams: [],
        };
      }
      grouped[tournamentId].approvedTeams.push({
        id: reg._id,
        team: reg.team,
        user: reg.user,
        approvedAt: reg.approvedAt,
        approvedBy: reg.approvedBy,
      });
    });

    return {
      registrations: Object.values(grouped),
    };
  }
}

import { TeamService } from "./teamService.js";
import Registration from "../registration/registrationModel.js";
import Tournament from "../tournament/tournamentModel.js";

const teamService = new TeamService();

// Create a new team
export const createTeam = async (req, res) => {
  try {
    const teamData = { ...req.body };

    // Extract tournament if provided (will create registration instead)
    const tournamentId = teamData.tournament;
    delete teamData.tournament; // Remove from team data

    // Add the logged user ID as the creator
    teamData.createdBy = req.user.id;

    // If a file was uploaded, add the file path to teamData
    if (req.file) {
      teamData.teamLogo = `/uploads/teams/${req.file.filename}`;
    }

    const team = await teamService.createTeam(teamData);

    // If tournament was provided, create a registration instead of associating team directly
    let registration = null;
    if (tournamentId) {
      // Validate tournament exists
      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(400).json({ message: "Torneo no encontrado" });
      }

      // Create registration with status "pending"
      registration = new Registration({
        tournament: tournamentId,
        team: team.id,
        user: req.user.id,
        status: "pending",
        appliedAt: new Date(),
      });

      await registration.save();

      // Populate registration data
      await registration.populate([
        { path: "tournament", select: "name sportType" },
        { path: "team", select: "name teamLogo" },
        { path: "user", select: "name email" },
      ]);
    }

    res.status(201).json({
      team,
      registration: registration || null,
      message: registration
        ? "Equipo creado e inscripción a torneo creada con estado pending"
        : "Equipo creado exitosamente",
    });
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all teams or filter by tournament
export const getAllTeams = async (req, res) => {
  try {
    // Check if tournament query parameter is provided
    if (req.query.tournament) {
      const teams = await teamService.getTeamsByTournament(
        req.query.tournament
      );
      return res.status(200).json({ teams });
    }

    // Otherwise get all teams
    const teams = await teamService.getAllTeams();
    res.status(200).json({ teams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my teams (teams created by the logged user - for captains)
export const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;
    const teams = await teamService.getMyTeams(userId);
    res.status(200).json({ teams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get teams by tournament
export const getTeamsByTournament = async (req, res) => {
  try {
    const teams = await teamService.getTeamsByTournament(
      req.params.tournamentId
    );
    res.status(200).json({ teams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single team by ID
export const getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.status(200).json({ team });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update a team
export const updateTeam = async (req, res) => {
  try {
    const teamData = { ...req.body };

    // If a file was uploaded, add the file path to teamData
    if (req.file) {
      teamData.teamLogo = `/uploads/teams/${req.file.filename}`;
    }

    const team = await teamService.updateTeam(
      req.params.id,
      teamData,
      req.user.id
    );
    res.status(200).json({ team });
  } catch (err) {
    if (err.message === "No tienes permiso para realizar esta acción") {
      return res.status(403).json({ message: err.message });
    }
    res.status(400).json({ message: err.message });
  }
};

// Delete a team
export const deleteTeam = async (req, res) => {
  try {
    const result = await teamService.deleteTeam(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "No tienes permiso para realizar esta acción") {
      return res.status(403).json({ message: err.message });
    }
    res.status(404).json({ message: err.message });
  }
};

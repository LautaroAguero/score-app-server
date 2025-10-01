import { TeamService } from "./teamService.js";

const teamService = new TeamService();

// Create a new team
export const createTeam = async (req, res) => {
  try {
    const teamData = { ...req.body };

    // If a file was uploaded, add the file path to teamData
    if (req.file) {
      teamData.teamLogo = `/uploads/teams/${req.file.filename}`;
    }

    const team = await teamService.createTeam(teamData);
    res.status(201).json({ team });
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all teams
export const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
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

    const team = await teamService.updateTeam(req.params.id, teamData);
    res.status(200).json({ team });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a team
export const deleteTeam = async (req, res) => {
  try {
    const result = await teamService.deleteTeam(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

import Team from "./teamModel.js";
import Tournament from "../tournament/tournamentModel.js";

export class TeamService {
  // Create a new team
  async createTeam(teamData) {
    // Tournament field is now optional - no validation needed here
    // If tournament was provided, controller will handle registration creation

    const team = new Team(teamData);
    await team.save();

    // Populate created by data
    await team.populate("createdBy", "name email");

    return {
      id: team._id,
      name: team.name,
      tournament: team.tournament || null,
      createdBy: team.createdBy,
      group: team.group,
      teamLogo: team.teamLogo,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  // Get all teams
  async getAllTeams() {
    const teams = await Team.find()
      .sort({ createdAt: -1 })
      .populate("tournament", "name sportType");
    return teams;
  }

  // Get teams created by a specific user (for team captain to select their teams)
  async getMyTeams(userId) {
    const teams = await Team.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate("tournament", "name sportType")
      .populate("createdBy", "name email");
    return teams;
  }

  // Get teams by tournament
  async getTeamsByTournament(tournamentId) {
    const teams = await Team.find({ tournament: tournamentId })
      .sort({ group: 1, name: 1 })
      .populate("tournament", "name sportType");
    return teams;
  }

  // Get a single team by ID
  async getTeamById(id) {
    const team = await Team.findById(id).populate(
      "tournament",
      "name sportType"
    );
    if (!team) {
      throw new Error("Equipo no encontrado");
    }
    return team;
  }

  // Update a team
  async updateTeam(id, teamData, userId) {
    const team = await Team.findById(id).populate("tournament");

    if (!team) {
      throw new Error("Equipo no encontrado");
    }

    // Verify that the user is the creator of the team
    if (team.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    const updatedTeam = await Team.findByIdAndUpdate(id, teamData, {
      new: true,
      runValidators: true,
    })
      .populate("tournament", "name sportType")
      .populate("createdBy", "name email");

    return {
      id: updatedTeam._id,
      name: updatedTeam.name,
      tournament: updatedTeam.tournament,
      createdBy: updatedTeam.createdBy,
      group: updatedTeam.group,
      teamLogo: updatedTeam.teamLogo,
      createdAt: updatedTeam.createdAt,
      updatedAt: updatedTeam.updatedAt,
    };
  }

  // Delete a team
  async deleteTeam(id, userId) {
    const team = await Team.findById(id).populate("tournament");

    if (!team) {
      throw new Error("Equipo no encontrado");
    }

    // Verify that the user is the creator of the team
    if (team.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    await Team.findByIdAndDelete(id);
    return { message: "Equipo eliminado exitosamente" };
  }
}

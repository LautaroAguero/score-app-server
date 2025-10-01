import Team from "./teamModel.js";
import Tournament from "../tournament/tournamentModel.js";

export class TeamService {
  // Create a new team
  async createTeam(teamData) {
    // Validate that the tournament exists
    const tournament = await Tournament.findById(teamData.tournament);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    const team = new Team(teamData);
    await team.save();

    // Populate tournament data before returning
    await team.populate("tournament", "name sportType");

    return {
      id: team._id,
      name: team.name,
      tournament: team.tournament,
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
  async updateTeam(id, teamData) {
    const team = await Team.findByIdAndUpdate(id, teamData, {
      new: true,
      runValidators: true,
    }).populate("tournament", "name sportType");

    if (!team) {
      throw new Error("Equipo no encontrado");
    }

    return {
      id: team._id,
      name: team.name,
      tournament: team.tournament,
      group: team.group,
      teamLogo: team.teamLogo,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  // Delete a team
  async deleteTeam(id) {
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      throw new Error("Equipo no encontrado");
    }
    return { message: "Equipo eliminado exitosamente" };
  }
}

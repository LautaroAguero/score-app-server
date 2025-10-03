import Match from "./matchModel.js";
import Tournament from "../tournament/tournamentModel.js";
import Team from "../team/teamModel.js";

export class MatchService {
  // Create a new match
  async createMatch(matchData) {
    // Validate that tournament exists
    const tournament = await Tournament.findById(matchData.tournament);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // Validate that home team exists
    const homeTeam = await Team.findById(matchData.homeTeam);
    if (!homeTeam) {
      throw new Error("Equipo local no encontrado");
    }

    // Validate that away team exists
    const awayTeam = await Team.findById(matchData.awayTeam);
    if (!awayTeam) {
      throw new Error("Equipo visitante no encontrado");
    }

    // Validate that both teams belong to the same tournament
    if (
      homeTeam.tournament.toString() !== matchData.tournament ||
      awayTeam.tournament.toString() !== matchData.tournament
    ) {
      throw new Error("Ambos equipos deben pertenecer al mismo torneo");
    }

    // Validate that home and away teams are different
    if (matchData.homeTeam === matchData.awayTeam) {
      throw new Error("El equipo local y visitante deben ser diferentes");
    }

    const match = new Match(matchData);
    await match.save();

    // Populate tournament and team data before returning
    await match.populate([
      { path: "tournament", select: "name sportType" },
      { path: "homeTeam", select: "name teamLogo" },
      { path: "awayTeam", select: "name teamLogo" },
    ]);

    return {
      id: match._id,
      tournament: match.tournament,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      matchDate: match.matchDate,
      matchTime: match.matchTime,
      venue: match.venue,
      stage: match.stage,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      status: match.status,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    };
  }

  // Get all matches
  async getAllMatches() {
    const matches = await Match.find()
      .sort({ matchDate: 1, createdAt: -1 })
      .populate("tournament", "name sportType")
      .populate("homeTeam", "name teamLogo")
      .populate("awayTeam", "name teamLogo");
    return matches;
  }

  // Get matches by tournament
  async getMatchesByTournament(tournamentId) {
    const matches = await Match.find({ tournament: tournamentId })
      .sort({ matchDate: 1, matchTime: 1 })
      .populate("tournament", "name sportType")
      .populate("homeTeam", "name teamLogo")
      .populate("awayTeam", "name teamLogo");
    return matches;
  }

  // Get a single match by ID
  async getMatchById(id) {
    const match = await Match.findById(id)
      .populate("tournament", "name sportType")
      .populate("homeTeam", "name teamLogo")
      .populate("awayTeam", "name teamLogo");

    if (!match) {
      throw new Error("Partido no encontrado");
    }
    return match;
  }

  // Update a match
  async updateMatch(id, matchData) {
    // If updating teams, validate they exist and belong to the same tournament
    if (matchData.homeTeam || matchData.awayTeam) {
      const match = await Match.findById(id);
      if (!match) {
        throw new Error("Partido no encontrado");
      }

      const tournament = matchData.tournament || match.tournament;

      if (matchData.homeTeam) {
        const homeTeam = await Team.findById(matchData.homeTeam);
        if (!homeTeam) {
          throw new Error("Equipo local no encontrado");
        }
        if (homeTeam.tournament.toString() !== tournament.toString()) {
          throw new Error("El equipo local debe pertenecer al torneo");
        }
      }

      if (matchData.awayTeam) {
        const awayTeam = await Team.findById(matchData.awayTeam);
        if (!awayTeam) {
          throw new Error("Equipo visitante no encontrado");
        }
        if (awayTeam.tournament.toString() !== tournament.toString()) {
          throw new Error("El equipo visitante debe pertenecer al torneo");
        }
      }

      // Validate teams are different
      const finalHomeTeam = matchData.homeTeam || match.homeTeam;
      const finalAwayTeam = matchData.awayTeam || match.awayTeam;
      if (finalHomeTeam.toString() === finalAwayTeam.toString()) {
        throw new Error("El equipo local y visitante deben ser diferentes");
      }
    }

    const match = await Match.findByIdAndUpdate(id, matchData, {
      new: true,
      runValidators: true,
    })
      .populate("tournament", "name sportType")
      .populate("homeTeam", "name teamLogo")
      .populate("awayTeam", "name teamLogo");

    if (!match) {
      throw new Error("Partido no encontrado");
    }

    return {
      id: match._id,
      tournament: match.tournament,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      matchDate: match.matchDate,
      matchTime: match.matchTime,
      venue: match.venue,
      stage: match.stage,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      status: match.status,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    };
  }

  // Delete a match
  async deleteMatch(id) {
    const match = await Match.findByIdAndDelete(id);
    if (!match) {
      throw new Error("Partido no encontrado");
    }
    return { message: "Partido eliminado exitosamente" };
  }
}

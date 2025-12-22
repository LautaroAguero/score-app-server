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
  async updateMatch(id, matchData, userId) {
    // Get the match and populate tournament to check ownership
    const match = await Match.findById(id).populate("tournament");
    if (!match) {
      throw new Error("Partido no encontrado");
    }

    // Verify ownership: user must be the tournament creator
    if (match.tournament.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    // If updating teams, validate they exist and belong to the same tournament
    if (matchData.homeTeam || matchData.awayTeam) {
      const tournament = matchData.tournament || match.tournament._id;

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

    const updatedMatch = await Match.findByIdAndUpdate(id, matchData, {
      new: true,
      runValidators: true,
    })
      .populate("tournament", "name sportType")
      .populate("homeTeam", "name teamLogo")
      .populate("awayTeam", "name teamLogo");

    return {
      id: updatedMatch._id,
      tournament: updatedMatch.tournament,
      homeTeam: updatedMatch.homeTeam,
      awayTeam: updatedMatch.awayTeam,
      matchDate: updatedMatch.matchDate,
      matchTime: updatedMatch.matchTime,
      venue: updatedMatch.venue,
      stage: updatedMatch.stage,
      homeTeamScore: updatedMatch.homeTeamScore,
      awayTeamScore: updatedMatch.awayTeamScore,
      status: updatedMatch.status,
      createdAt: updatedMatch.createdAt,
      updatedAt: updatedMatch.updatedAt,
    };
  }

  // Delete a match
  async deleteMatch(id, userId) {
    const match = await Match.findById(id).populate("tournament");
    if (!match) {
      throw new Error("Partido no encontrado");
    }

    // Verify ownership: user must be the tournament creator
    if (match.tournament.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    await Match.findByIdAndDelete(id);
    return { message: "Partido eliminado exitosamente" };
  }

  // Bulk schedule multiple matches
  async bulkScheduleMatches(updates, userId) {
    if (!updates || updates.length === 0) {
      throw new Error("Debe proporcionar al menos 1 match para agendar");
    }

    // 1. Get all matches to validate ownership
    const matchIds = updates.map((u) => u.matchId);
    const matches = await Match.find({ _id: { $in: matchIds } }).populate(
      "tournament"
    );

    if (matches.length !== matchIds.length) {
      throw new Error("Uno o más matches no existen");
    }

    // 2. Validate all matches belong to tournaments owned by the user
    const userTournaments = new Set();
    for (const match of matches) {
      if (match.tournament.createdBy.toString() !== userId) {
        throw new Error(
          "No tienes permiso para agendar matches de este torneo"
        );
      }
      userTournaments.add(match.tournament._id.toString());
    }

    // 3. Validate dates are in the future
    const now = new Date();
    const updatedMatches = [];

    for (const update of updates) {
      // Find the match object
      const match = matches.find((m) => m._id.toString() === update.matchId);
      if (!match) {
        throw new Error(`Match con ID ${update.matchId} no encontrado`);
      }

      // Parse date and time
      const matchDateTime = new Date(
        `${update.matchDate}T${update.matchTime}:00`
      );

      // Validate date is in the future
      if (matchDateTime <= now) {
        throw new Error(
          `La fecha y hora del match ${match._id} no puede ser en el pasado`
        );
      }

      // Update the match
      match.matchDate = update.matchDate;
      match.matchTime = update.matchTime;

      updatedMatches.push(match);
    }

    // 4. Save all updated matches
    const savedMatches = [];
    for (const match of updatedMatches) {
      await match.save();
      savedMatches.push({
        id: match._id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        matchDate: match.matchDate,
        matchTime: match.matchTime,
        status: match.status,
      });
    }

    // 5. Return results
    return {
      success: true,
      matchesUpdated: savedMatches.length,
      matches: savedMatches,
    };
  }
}

import Tournament from "./tournamentModel.js";
import Team from "../team/teamModel.js";
import Match from "../match/matchModel.js";

export class TournamentService {
  // Create a new tournament
  async createTournament(tournamentData) {
    const tournament = new Tournament(tournamentData);
    await tournament.save();

    return {
      id: tournament._id,
      name: tournament.name,
      description: tournament.description,
      createdBy: tournament.createdBy,
      sportType: tournament.sportType,
      tournamentFormat: tournament.tournamentFormat,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      location: tournament.location,
      tournamentDetails: tournament.tournamentDetails,
      numberOfParticipants: tournament.numberOfParticipants,
      prizes: tournament.prizes,
      tournamentBanner: tournament.tournamentBanner,
      rules: tournament.rules,
      pointsForWin: tournament.pointsForWin,
      pointsForDraw: tournament.pointsForDraw,
      pointsForLoss: tournament.pointsForLoss,
      status: tournament.status,
      createdAt: tournament.createdAt,
      updatedAt: tournament.updatedAt,
    };
  }

  // Get all tournaments
  async getAllTournaments() {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    return tournaments;
  }

  // Get tournaments created by a specific user
  async getTournamentsByUser(userId) {
    const tournaments = await Tournament.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");
    return tournaments;
  }

  // Get a single tournament by ID
  async getTournamentById(id) {
    const tournament = await Tournament.findById(id);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }
    return tournament;
  }

  // Update a tournament
  async updateTournament(id, tournamentData) {
    const tournament = await Tournament.findByIdAndUpdate(id, tournamentData, {
      new: true,
      runValidators: true,
    });

    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    return {
      id: tournament._id,
      name: tournament.name,
      description: tournament.description,
      createdBy: tournament.createdBy,
      sportType: tournament.sportType,
      tournamentFormat: tournament.tournamentFormat,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      location: tournament.location,
      tournamentDetails: tournament.tournamentDetails,
      numberOfParticipants: tournament.numberOfParticipants,
      prizes: tournament.prizes,
      tournamentBanner: tournament.tournamentBanner,
      rules: tournament.rules,
      pointsForWin: tournament.pointsForWin,
      pointsForDraw: tournament.pointsForDraw,
      pointsForLoss: tournament.pointsForLoss,
      status: tournament.status,
      createdAt: tournament.createdAt,
      updatedAt: tournament.updatedAt,
    };
  }

  // Delete a tournament
  async deleteTournament(id) {
    const tournament = await Tournament.findByIdAndDelete(id);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }
    return { message: "Torneo eliminado exitosamente" };
  }

  // Get tournament standings
  async getTournamentStandings(tournamentId) {
    // Validate tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // Get all teams in the tournament
    const teams = await Team.find({ tournament: tournamentId });
    if (teams.length === 0) {
      return {
        tournament: {
          id: tournament._id,
          name: tournament.name,
          sportType: tournament.sportType,
        },
        standings: [],
      };
    }

    // Get all completed matches for this tournament
    const matches = await Match.find({
      tournament: tournamentId,
      status: "completed",
    }).populate("homeTeam awayTeam", "name teamLogo");

    // Initialize standings for each team
    const standingsMap = {};
    teams.forEach((team) => {
      standingsMap[team._id.toString()] = {
        team: {
          id: team._id,
          name: team.name,
          teamLogo: team.teamLogo,
          group: team.group,
        },
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    });

    // Calculate standings from completed matches
    matches.forEach((match) => {
      const homeTeamId = match.homeTeam._id.toString();
      const awayTeamId = match.awayTeam._id.toString();
      const homeScore = match.homeTeamScore || 0;
      const awayScore = match.awayTeamScore || 0;

      // Update stats for both teams
      if (standingsMap[homeTeamId]) {
        standingsMap[homeTeamId].played++;
        standingsMap[homeTeamId].goalsFor += homeScore;
        standingsMap[homeTeamId].goalsAgainst += awayScore;

        if (homeScore > awayScore) {
          // Home team won
          standingsMap[homeTeamId].won++;
          standingsMap[homeTeamId].points += tournament.pointsForWin;
        } else if (homeScore === awayScore) {
          // Draw
          standingsMap[homeTeamId].drawn++;
          standingsMap[homeTeamId].points += tournament.pointsForDraw;
        } else {
          // Home team lost
          standingsMap[homeTeamId].lost++;
          standingsMap[homeTeamId].points += tournament.pointsForLoss;
        }
      }

      if (standingsMap[awayTeamId]) {
        standingsMap[awayTeamId].played++;
        standingsMap[awayTeamId].goalsFor += awayScore;
        standingsMap[awayTeamId].goalsAgainst += homeScore;

        if (awayScore > homeScore) {
          // Away team won
          standingsMap[awayTeamId].won++;
          standingsMap[awayTeamId].points += tournament.pointsForWin;
        } else if (awayScore === homeScore) {
          // Draw
          standingsMap[awayTeamId].drawn++;
          standingsMap[awayTeamId].points += tournament.pointsForDraw;
        } else {
          // Away team lost
          standingsMap[awayTeamId].lost++;
          standingsMap[awayTeamId].points += tournament.pointsForLoss;
        }
      }
    });

    // Calculate goal difference for each team
    Object.values(standingsMap).forEach((standing) => {
      standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
    });

    // Convert to array and sort by points (desc), then goal difference (desc), then goals for (desc)
    const standings = Object.values(standingsMap).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference)
        return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    // Add position/rank
    standings.forEach((standing, index) => {
      standing.position = index + 1;
    });

    return {
      tournament: {
        id: tournament._id,
        name: tournament.name,
        sportType: tournament.sportType,
        pointsForWin: tournament.pointsForWin,
        pointsForDraw: tournament.pointsForDraw,
        pointsForLoss: tournament.pointsForLoss,
      },
      standings,
    };
  }
}

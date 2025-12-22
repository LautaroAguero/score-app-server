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
  async updateTournament(id, tournamentData, userId) {
    const tournament = await Tournament.findById(id);

    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // Verify ownership
    if (tournament.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      tournamentData,
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      id: updatedTournament._id,
      name: updatedTournament.name,
      description: updatedTournament.description,
      createdBy: updatedTournament.createdBy,
      sportType: updatedTournament.sportType,
      tournamentFormat: updatedTournament.tournamentFormat,
      startDate: updatedTournament.startDate,
      endDate: updatedTournament.endDate,
      location: updatedTournament.location,
      tournamentDetails: updatedTournament.tournamentDetails,
      numberOfParticipants: updatedTournament.numberOfParticipants,
      prizes: updatedTournament.prizes,
      tournamentBanner: updatedTournament.tournamentBanner,
      rules: updatedTournament.rules,
      pointsForWin: updatedTournament.pointsForWin,
      pointsForDraw: updatedTournament.pointsForDraw,
      pointsForLoss: updatedTournament.pointsForLoss,
      status: updatedTournament.status,
      createdAt: updatedTournament.createdAt,
      updatedAt: updatedTournament.updatedAt,
    };
  }

  // Delete a tournament
  async deleteTournament(id, userId) {
    const tournament = await Tournament.findById(id);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // Verify ownership
    if (tournament.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    await Tournament.findByIdAndDelete(id);
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

  // Add multiple teams to a tournament
  async addTeamsToTournament(tournamentId, teamIds, userId) {
    // 1. Validar que el torneo existe
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // 2. Validar que el torneo pertenece al usuario
    if (tournament.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    // 3. Validar que todos los teamIds existen y pertenecen al torneo
    const teams = await Team.find({
      _id: { $in: teamIds },
      tournament: tournamentId,
    });

    if (teams.length !== teamIds.length) {
      throw new Error(
        "Uno o más equipos no existen o no pertenecen a este torneo"
      );
    }

    // 4. Validar que no exceda 32 equipos (máximo permitido)
    const currentTeamCount = await Team.countDocuments({
      tournament: tournamentId,
    });

    if (currentTeamCount > 32) {
      throw new Error("No puede haber más de 32 equipos en el torneo");
    }

    // 5. Retornar el torneo actualizado con los equipos
    const updatedTournament = await Tournament.findById(tournamentId)
      .populate("createdBy", "name email")
      .exec();

    return {
      id: updatedTournament._id,
      name: updatedTournament.name,
      description: updatedTournament.description,
      createdBy: updatedTournament.createdBy,
      sportType: updatedTournament.sportType,
      tournamentFormat: updatedTournament.tournamentFormat,
      status: updatedTournament.status,
      numberOfParticipants: updatedTournament.numberOfParticipants,
      pointsForWin: updatedTournament.pointsForWin,
      pointsForDraw: updatedTournament.pointsForDraw,
      pointsForLoss: updatedTournament.pointsForLoss,
      createdAt: updatedTournament.createdAt,
      updatedAt: updatedTournament.updatedAt,
    };
  }

  // Generate League (Round-Robin) matches
  async generateLeagueMatches(teams, twoLegs = false) {
    if (!teams || teams.length < 2) {
      throw new Error("Se requiere mínimo 2 equipos para generar partidos");
    }

    const matches = [];
    const teamIds = teams.map((team) =>
      team._id ? team._id.toString() : team.toString()
    );

    // Generate round-robin fixtures
    const fixtures = this._generateRoundRobin(teamIds, twoLegs);

    // Convert fixtures to match objects with jornada (round) numbers
    fixtures.forEach((fixture, index) => {
      const jornada = this._calculateJornada(index, teamIds.length, twoLegs);

      matches.push({
        homeTeamId: fixture.home,
        awayTeamId: fixture.away,
        jornada: jornada,
        status: "scheduled",
        tournamentFormat: "league",
      });
    });

    return matches;
  }

  // Helper: Generate round-robin pairs
  _generateRoundRobin(teamIds, twoLegs = false) {
    const matches = [];
    const n = teamIds.length;
    const isOdd = n % 2 === 1;
    const numTeams = isOdd ? n + 1 : n;

    // Create list of teams (add bye if odd number)
    const teams = [...teamIds];
    if (isOdd) {
      teams.push(null); // null represents bye
    }

    // First leg
    for (let round = 0; round < numTeams - 1; round++) {
      for (let i = 0; i < numTeams / 2; i++) {
        const homeIdx = i;
        const awayIdx = numTeams - 1 - i;

        const home = teams[homeIdx];
        const away = teams[awayIdx];

        // Skip if either team is a bye
        if (home !== null && away !== null) {
          matches.push({ home, away });
        }
      }

      // Rotate teams for next round (except first and last)
      teams.splice(1, 0, teams.pop());
    }

    // Second leg (return matches)
    if (twoLegs) {
      const firstLegCount = matches.length;
      for (let i = 0; i < firstLegCount; i++) {
        matches.push({
          home: matches[i].away,
          away: matches[i].home,
        });
      }
    }

    return matches;
  }

  // Helper: Calculate jornada (round/matchday) number
  _calculateJornada(matchIndex, numTeams, twoLegs) {
    const matchesPerJornada =
      numTeams % 2 === 0 ? numTeams / 2 : (numTeams - 1) / 2;
    const totalJornadas = twoLegs ? (numTeams - 1) * 2 : numTeams - 1;

    // Find which jornada this match belongs to
    for (let jornada = 1; jornada <= totalJornadas; jornada++) {
      const startIdx = (jornada - 1) * matchesPerJornada;
      const endIdx = jornada * matchesPerJornada;

      if (matchIndex >= startIdx && matchIndex < endIdx) {
        return jornada;
      }
    }

    return 1;
  }

  // Generate Knockout (Elimination) matches
  async generateKnockoutMatches(teams) {
    if (!teams || teams.length < 2) {
      throw new Error("Se requiere mínimo 2 equipos para generar partidos");
    }

    const teamCount = teams.length;

    // Check if power of 2
    const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

    if (!isPowerOfTwo(teamCount)) {
      throw new Error(
        `El número de equipos (${teamCount}) debe ser una potencia de 2 (2, 4, 8, 16, 32)`
      );
    }

    const matches = [];
    const teamIds = teams.map((team) =>
      team._id ? team._id.toString() : team.toString()
    );

    // Generate knockout bracket
    const rounds = this._generateKnockoutRounds(teamIds);

    // Convert rounds to match objects
    rounds.forEach((round, roundIndex) => {
      const roundNumber = roundIndex + 1;
      const roundName = this._getRoundName(roundNumber, Math.log2(teamCount));

      round.forEach((match, matchIndex) => {
        matches.push({
          homeTeamId: match.home,
          awayTeamId: match.away,
          roundNumber: roundNumber,
          roundName: roundName,
          status: "scheduled",
          tournamentFormat: "knockout",
        });
      });
    });

    return matches;
  }

  // Helper: Generate knockout round structure
  _generateKnockoutRounds(teamIds) {
    const rounds = [];
    let currentRound = [...teamIds];

    while (currentRound.length > 1) {
      const matches = [];

      // Create matches by pairing consecutive teams
      for (let i = 0; i < currentRound.length; i += 2) {
        matches.push({
          home: currentRound[i],
          away: currentRound[i + 1],
        });
      }

      rounds.push(matches);

      // Next round will have winners only (placeholder structure)
      currentRound = currentRound
        .map((_, i) => {
          if (i % 2 === 0) {
            return `winner_match_${rounds.length - 1}_${Math.floor(i / 2)}`;
          }
          return null;
        })
        .filter(Boolean);
    }

    return rounds;
  }

  // Helper: Get round name (Octavos, Cuartos, Semis, Final, etc)
  _getRoundName(roundNumber, totalRounds) {
    const roundsRemaining = totalRounds - roundNumber + 1;

    switch (roundsRemaining) {
      case 1:
        return "Final";
      case 2:
        return "Semifinal";
      case 3:
        return "Cuartos de Final";
      case 4:
        return "Octavos de Final";
      case 5:
        return "Dieciseisavos de Final";
      default:
        return `Ronda ${roundNumber}`;
    }
  }

  // Generate Hybrid (Groups + Knockout) matches
  async generateHybridMatches(teams) {
    if (!teams || teams.length < 2) {
      throw new Error("Se requiere mínimo 2 equipos para generar partidos");
    }

    const teamCount = teams.length;
    const teamIds = teams.map((team) =>
      team._id ? team._id.toString() : team.toString()
    );

    // Calculate number of groups based on team count
    const numGroups = this._calculateOptimalGroups(teamCount);
    const teamsPerGroup = Math.ceil(teamCount / numGroups);

    // Divide teams into groups
    const groups = this._divideTeamsIntoGroups(teamIds, numGroups);

    const matches = [];
    let matchId = 0;

    // FASE 1: Group Stage (Round-robin within each group)
    groups.forEach((group, groupIndex) => {
      const groupLetter = String.fromCharCode(65 + groupIndex); // A, B, C, etc

      // Generate round-robin matches for this group
      const groupMatches = this._generateRoundRobin(group, false);

      groupMatches.forEach((fixture, index) => {
        const jornada = this._calculateJornada(index, group.length, false);

        matches.push({
          id: matchId++,
          homeTeamId: fixture.home,
          awayTeamId: fixture.away,
          phase: "groups",
          group: groupLetter,
          jornada: jornada,
          status: "scheduled",
          tournamentFormat: "hybrid",
        });
      });
    });

    // FASE 2: Knockout Stage (Top teams from each group)
    // Calculate how many teams qualify to knockout (usually 2 per group)
    const teamsToKnockout = Math.min(numGroups * 2, teamCount);

    // Create placeholders for knockout phase
    // In real scenario, qualified teams would be selected after group matches are played
    if (teamsToKnockout >= 2 && teamsToKnockout % 2 === 0) {
      const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

      if (isPowerOfTwo(teamsToKnockout)) {
        // Generate knockout structure with placeholder teams
        const knockoutTeams = Array.from(
          { length: teamsToKnockout },
          (_, i) => `qualified_team_${i}`
        );

        const knockoutRounds = this._generateKnockoutRounds(knockoutTeams);

        knockoutRounds.forEach((round, roundIndex) => {
          const roundNumber = roundIndex + 1;
          const roundName = this._getRoundName(
            roundNumber,
            Math.log2(teamsToKnockout)
          );

          round.forEach((match) => {
            matches.push({
              id: matchId++,
              homeTeamId: match.home,
              awayTeamId: match.away,
              phase: "knockout",
              roundNumber: roundNumber,
              roundName: roundName,
              status: "scheduled",
              tournamentFormat: "hybrid",
            });
          });
        });
      }
    }

    return matches;
  }

  // Helper: Calculate optimal number of groups
  _calculateOptimalGroups(teamCount) {
    // Logic: distribute teams evenly across groups
    // Common configurations:
    // 8 teams: 2 groups of 4
    // 12 teams: 3 groups of 4
    // 16 teams: 4 groups of 4 or 2 groups of 8
    // 32 teams: 4, 8 groups

    if (teamCount <= 4) return 1; // Single group
    if (teamCount <= 8) return 2;
    if (teamCount <= 12) return 3;
    if (teamCount <= 16) return 4;
    if (teamCount <= 24) return 4;
    return 8;
  }

  // Helper: Divide teams into balanced groups
  _divideTeamsIntoGroups(teamIds, numGroups) {
    const groups = Array.from({ length: numGroups }, () => []);

    // Distribute teams round-robin style to balance groups
    teamIds.forEach((teamId, index) => {
      const groupIndex = index % numGroups;
      groups[groupIndex].push(teamId);
    });

    return groups;
  }

  // Auto-generate matches based on tournament format
  async autoGenerateMatches(tournamentId, format, userId, twoLegs = false) {
    // 1. Validate tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // 2. Validate ownership
    if (tournament.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    // 3. Validate tournament is in setup status
    if (tournament.status !== "setup") {
      throw new Error(
        "El torneo debe estar en estado 'setup' para generar partidos"
      );
    }

    // 4. Get all teams for this tournament
    const teams = await Team.find({ tournament: tournamentId });

    // 5. Validate minimum teams (2) and maximum (32)
    if (teams.length < 2) {
      throw new Error("Se requiere mínimo 2 equipos para generar partidos");
    }

    if (teams.length > 32) {
      throw new Error("No puede haber más de 32 equipos en el torneo");
    }

    // 6. Validate format is valid
    const validFormats = ["league", "knockout", "hybrid"];
    if (!validFormats.includes(format)) {
      throw new Error(
        `Formato inválido. Debe ser uno de: ${validFormats.join(", ")}`
      );
    }

    // 7. Validate knockout requires power of 2
    if (format === "knockout") {
      const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;
      if (!isPowerOfTwo(teams.length)) {
        throw new Error(
          `El formato 'knockout' requiere una potencia de 2 equipos (2, 4, 8, 16, 32). Tienes ${teams.length}`
        );
      }
    }

    // 8. Generate matches based on format
    let generatedMatches = [];
    switch (format) {
      case "league":
        generatedMatches = await this.generateLeagueMatches(teams, twoLegs);
        break;
      case "knockout":
        generatedMatches = await this.generateKnockoutMatches(teams);
        break;
      case "hybrid":
        generatedMatches = await this.generateHybridMatches(teams);
        break;
    }

    // 9. Save matches to database
    const matchDocuments = generatedMatches.map((match) => ({
      tournament: tournamentId,
      homeTeam: match.homeTeamId,
      awayTeam: match.awayTeamId,
      status: match.status,
      // Optional fields based on format
      jornada: match.jornada || null,
      roundNumber: match.roundNumber || null,
      roundName: match.roundName || null,
      phase: match.phase || null,
      group: match.group || null,
      tournamentFormat: match.tournamentFormat,
    }));

    const savedMatches = await Match.insertMany(matchDocuments);

    // 10. Update tournament status to "inprogress"
    await Tournament.findByIdAndUpdate(
      tournamentId,
      { status: "inprogress" },
      { new: true }
    );

    // 11. Return generated matches
    return {
      success: true,
      tournamentId: tournamentId,
      format: format,
      matchesGenerated: savedMatches.length,
      matches: savedMatches.map((match) => ({
        id: match._id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        jornada: match.jornada,
        roundNumber: match.roundNumber,
        roundName: match.roundName,
        phase: match.phase,
        group: match.group,
        status: match.status,
        tournamentFormat: match.tournamentFormat,
      })),
    };
  }

  // Get setup status for a tournament
  async getSetupStatus(tournamentId) {
    // 1. Validate tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      throw new Error("Torneo no encontrado");
    }

    // 2. Get teams count
    const teamsCount = await Team.countDocuments({ tournament: tournamentId });

    // 3. Get matches count and details
    const allMatches = await Match.find({ tournament: tournamentId });
    const matchesCount = allMatches.length;

    // Count matches with scheduling (dates)
    const scheduledMatches = allMatches.filter(
      (match) => match.matchDate && match.matchTime
    ).length;

    // 4. Determine setup step
    let setupStep = 1; // Step 1: Tournament created (always true if we get here)
    let stepDescription = "Torneo creado";

    if (teamsCount >= 2) {
      setupStep = 2;
      stepDescription = `${teamsCount} equipos agregados`;
    }

    if (matchesCount > 0) {
      setupStep = 3;
      stepDescription = `${matchesCount} partidos generados`;
    }

    if (matchesCount > 0 && scheduledMatches === matchesCount) {
      setupStep = 4;
      stepDescription = `Todos los ${matchesCount} partidos agendados`;
    }

    // 5. Calculate progress percentage
    const maxStep = 4;
    const progressPercentage = Math.round((setupStep / maxStep) * 100);

    // 6. Build detailed progress object
    const progress = {
      step1_tournament_created: true,
      step2_teams_added: teamsCount >= 2,
      step2_teams_count: teamsCount,
      step2_teams_minimum: 2,
      step2_teams_maximum: 32,
      step3_matches_generated: matchesCount > 0,
      step3_matches_count: matchesCount,
      step4_matches_scheduled: scheduledMatches > 0,
      step4_matches_scheduled_count: scheduledMatches,
      step4_matches_fully_scheduled:
        scheduledMatches === matchesCount && matchesCount > 0,
    };

    // 7. Return status object
    return {
      tournamentId: tournament._id,
      tournamentName: tournament.name,
      tournamentStatus: tournament.status,
      currentSetupStep: setupStep,
      stepDescription: stepDescription,
      progressPercentage: progressPercentage,
      progress: progress,
      summary: {
        teamsReady: teamsCount >= 2,
        matchesGenerated: matchesCount > 0,
        matchesFullyScheduled:
          scheduledMatches === matchesCount && matchesCount > 0,
      },
    };
  }
}

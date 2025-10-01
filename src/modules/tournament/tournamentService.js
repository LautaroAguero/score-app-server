import Tournament from "./tournamentModel.js";

export class TournamentService {
  // Create a new tournament
  async createTournament(tournamentData) {
    const tournament = new Tournament(tournamentData);
    await tournament.save();

    return {
      id: tournament._id,
      name: tournament.name,
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
}

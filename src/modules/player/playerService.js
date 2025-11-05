import Player from "./playerModel.js";
import Team from "../team/teamModel.js";

export class PlayerService {
  // Create a new player
  async createPlayer(playerData) {
    // Validate that the team exists
    const team = await Team.findById(playerData.team);
    if (!team) {
      throw new Error("Equipo no encontrado");
    }

    const player = new Player(playerData);
    await player.save();

    // Populate team data before returning
    await player.populate("team", "name teamLogo");

    return {
      id: player._id,
      name: player.name,
      number: player.number,
      position: player.position,
      team: player.team,
      height: player.height,
      weight: player.weight,
      dateOfBirth: player.dateOfBirth,
      nationality: player.nationality,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }

  // Get all players
  async getAllPlayers() {
    const players = await Player.find()
      .sort({ createdAt: -1 })
      .populate("team", "name teamLogo");
    return players;
  }

  // Get players by team
  async getPlayersByTeam(teamId) {
    const players = await Player.find({ team: teamId })
      .sort({ number: 1, name: 1 })
      .populate("team", "name teamLogo");
    return players;
  }

  // Get a single player by ID
  async getPlayerById(id) {
    const player = await Player.findById(id).populate("team", "name teamLogo");
    if (!player) {
      throw new Error("Jugador no encontrado");
    }
    return player;
  }

  // Update a player
  async updatePlayer(id, playerData, userId) {
    const player = await Player.findById(id).populate({
      path: "team",
      populate: {
        path: "tournament",
      },
    });

    if (!player) {
      throw new Error("Jugador no encontrado");
    }

    // Verify that the user is the creator of the tournament
    if (player.team.tournament.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    // If team is being changed, validate the new team exists
    if (playerData.team && playerData.team !== player.team._id.toString()) {
      const newTeam = await Team.findById(playerData.team);
      if (!newTeam) {
        throw new Error("El nuevo equipo no existe");
      }
    }

    const updatedPlayer = await Player.findByIdAndUpdate(id, playerData, {
      new: true,
      runValidators: true,
    }).populate("team", "name teamLogo");

    return {
      id: updatedPlayer._id,
      name: updatedPlayer.name,
      number: updatedPlayer.number,
      position: updatedPlayer.position,
      team: updatedPlayer.team,
      height: updatedPlayer.height,
      weight: updatedPlayer.weight,
      dateOfBirth: updatedPlayer.dateOfBirth,
      nationality: updatedPlayer.nationality,
      createdAt: updatedPlayer.createdAt,
      updatedAt: updatedPlayer.updatedAt,
    };
  }

  // Delete a player
  async deletePlayer(id, userId) {
    const player = await Player.findById(id).populate({
      path: "team",
      populate: {
        path: "tournament",
      },
    });

    if (!player) {
      throw new Error("Jugador no encontrado");
    }

    // Verify that the user is the creator of the tournament
    if (player.team.tournament.createdBy.toString() !== userId) {
      throw new Error("No tienes permiso para realizar esta acción");
    }

    await Player.findByIdAndDelete(id);
    return { message: "Jugador eliminado exitosamente" };
  }
}

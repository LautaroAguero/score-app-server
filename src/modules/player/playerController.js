import { PlayerService } from "./playerService.js";

const playerService = new PlayerService();

// Create a new player
export const createPlayer = async (req, res) => {
  try {
    const player = await playerService.createPlayer(req.body);
    res.status(201).json({ player });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all players or filter by team
export const getAllPlayers = async (req, res) => {
  try {
    // Check if team query parameter is provided
    if (req.query.team) {
      const players = await playerService.getPlayersByTeam(req.query.team);
      return res.status(200).json({ players });
    }

    // Otherwise get all players
    const players = await playerService.getAllPlayers();
    res.status(200).json({ players });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single player by ID
export const getPlayerById = async (req, res) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    res.status(200).json({ player });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update a player
export const updatePlayer = async (req, res) => {
  try {
    const player = await playerService.updatePlayer(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json({ player });
  } catch (err) {
    if (err.message === "No tienes permiso para realizar esta acción") {
      return res.status(403).json({ message: err.message });
    }
    res.status(400).json({ message: err.message });
  }
};

// Delete a player
export const deletePlayer = async (req, res) => {
  try {
    const result = await playerService.deletePlayer(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "No tienes permiso para realizar esta acción") {
      return res.status(403).json({ message: err.message });
    }
    res.status(404).json({ message: err.message });
  }
};

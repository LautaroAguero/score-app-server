import { MatchService } from "./matchService.js";

const matchService = new MatchService();

// Create a new match
export const createMatch = async (req, res) => {
  try {
    console.log("Received match data:", req.body); // Debug log
    const match = await matchService.createMatch(req.body);
    res.status(201).json({ match });
  } catch (err) {
    console.error("Error creating match:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all matches
export const getAllMatches = async (req, res) => {
  try {
    const matches = await matchService.getAllMatches();
    res.status(200).json({ matches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get matches by tournament
export const getMatchesByTournament = async (req, res) => {
  try {
    const matches = await matchService.getMatchesByTournament(
      req.params.tournamentId
    );
    res.status(200).json({ matches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single match by ID
export const getMatchById = async (req, res) => {
  try {
    const match = await matchService.getMatchById(req.params.id);
    res.status(200).json({ match });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update a match
export const updateMatch = async (req, res) => {
  try {
    const match = await matchService.updateMatch(req.params.id, req.body);
    res.status(200).json({ match });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a match
export const deleteMatch = async (req, res) => {
  try {
    const result = await matchService.deleteMatch(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

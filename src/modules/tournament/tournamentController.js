import { TournamentService } from "./tournamentService.js";

const tournamentService = new TournamentService();

// Create a new tournament
export const createTournament = async (req, res) => {
  try {
    const tournamentData = { ...req.body };

    // Add the logged user ID as the creator
    tournamentData.createdBy = req.user.id;

    // If a file was uploaded, add the file path to tournamentData
    if (req.file) {
      tournamentData.tournamentBanner = `/uploads/tournaments/${req.file.filename}`;
    }

    const tournament = await tournamentService.createTournament(tournamentData);
    res.status(201).json({ tournament });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tournaments
export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.status(200).json({ tournaments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single tournament by ID
export const getTournamentById = async (req, res) => {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);
    res.status(200).json({ tournament });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update a tournament
export const updateTournament = async (req, res) => {
  try {
    const tournamentData = { ...req.body };

    // If a file was uploaded, add the file path to tournamentData
    if (req.file) {
      tournamentData.tournamentBanner = `/uploads/tournaments/${req.file.filename}`;
    }

    const tournament = await tournamentService.updateTournament(
      req.params.id,
      tournamentData
    );
    res.status(200).json({ tournament });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a tournament
export const deleteTournament = async (req, res) => {
  try {
    const result = await tournamentService.deleteTournament(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Get tournaments created by the logged user
export const getMyTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getTournamentsByUser(
      req.user.id
    );
    res.status(200).json({ tournaments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

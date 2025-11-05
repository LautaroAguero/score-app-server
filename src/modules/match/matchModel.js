import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    matchDate: {
      type: Date,
      required: false,
    },
    matchTime: {
      type: String,
      required: false,
    },
    venue: {
      type: String,
      required: false,
      trim: true,
    },
    stage: {
      type: String,
      required: false,
      trim: true,
    },
    homeTeamScore: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    awayTeamScore: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["scheduled", "playing", "completed"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
// Index: Fast lookup of matches by tournament (used in getMatchesByTournament)
matchSchema.index({ tournament: 1 });
// Index: Fast lookup of matches by status (used for standings, active matches)
matchSchema.index({ status: 1 });
// Compound Index: Fast lookup for tournament-specific match filters with status
matchSchema.index({ tournament: 1, status: 1 });

export default mongoose.model("Match", matchSchema);

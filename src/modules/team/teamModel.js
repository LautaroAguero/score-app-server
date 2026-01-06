import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: String,
      required: false,
      trim: true,
    },
    teamLogo: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
// Index: Fast lookup of teams by tournament (used in getTeamsByTournament)
teamSchema.index({ tournament: 1 });
// Index: Fast lookup of teams by creator
teamSchema.index({ createdBy: 1 });
// Index: Fast lookup of teams by tournament and creator
teamSchema.index({ tournament: 1, createdBy: 1 });

export default mongoose.model("Team", teamSchema);

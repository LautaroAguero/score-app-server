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

export default mongoose.model("Match", matchSchema);

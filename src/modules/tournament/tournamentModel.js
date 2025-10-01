import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sportType: {
      type: String,
      required: true,
      enum: ["soccer", "basketball", "volleyball", "tennis", "rugby"],
    },
    tournamentFormat: {
      type: String,
      required: true,
      enum: ["league", "knockout", "hybrid"],
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    tournamentDetails: {
      type: String,
      required: false,
      trim: true,
    },
    numberOfParticipants: {
      type: Number,
      required: true,
    },
    prizes: {
      type: String,
      required: false,
      trim: true,
    },
    tournamentBanner: {
      type: String,
      required: false,
      trim: true,
    },
    rules: {
      type: String,
      required: false,
      trim: true,
    },
    pointsForWin: {
      type: Number,
      required: true,
      default: 3,
    },
    pointsForDraw: {
      type: Number,
      required: true,
      default: 1,
    },
    pointsForLoss: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["upcoming", "inprogress", "finished"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Tournament", tournamentSchema);

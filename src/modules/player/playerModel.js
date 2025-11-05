import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    number: {
      type: Number,
      min: 0,
      max: 99,
    },
    position: {
      type: String,
      maxlength: 50,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    height: {
      type: Number, // in cm
      min: 50,
      max: 300,
    },
    weight: {
      type: Number, // in kg
      min: 20,
      max: 200,
    },
    dateOfBirth: {
      type: Date,
    },
    nationality: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

// Index for frequently queried fields
// Index: Fast lookup of players by team (used in getPlayersByTeam)
playerSchema.index({ team: 1 });

const Player = mongoose.model("Player", playerSchema);

export default Player;

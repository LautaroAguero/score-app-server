import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
      required: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    rejectionReason: {
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
// Prevent duplicate registrations: same team in same tournament
registrationSchema.index({ tournament: 1, team: 1 }, { unique: true });
// Fast lookup of registrations by tournament
registrationSchema.index({ tournament: 1 });
// Fast lookup of registrations by user
registrationSchema.index({ user: 1 });
// Fast lookup of registrations by status
registrationSchema.index({ tournament: 1, status: 1 });

export default mongoose.model("Registration", registrationSchema);

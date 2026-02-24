const mongoose = require("mongoose");

const WingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    totalUnits: {
      type: Number,
      required: true,
      min: 1,
    },
    unitTypes: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to UnitTypes model
        ref: "UnitType",
        required: true,
      },
    ],
    totalParkings: {
      type: Number,
      required: true,
    },
    parkingType: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Parking model
        ref: "Parking",
        required: true,

      },
    ],
    numberOfFloors: {
      type: Number,
      required: true,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wing", WingSchema);

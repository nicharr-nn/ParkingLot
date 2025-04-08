import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
    spots: {
      type: [
        {
          spotNumber: Number,
          size: String,
          isAvailable: Boolean,
          vehicleType: {
            type: String,
            enum: ["Car", "Bus", "Motorcycle", null],
          },
        },
      ],
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
  });

const ParkingLevels = mongoose.model("Level", levelSchema);

export default ParkingLevels;
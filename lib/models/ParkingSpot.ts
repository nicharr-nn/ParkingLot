import mongoose, { Schema, Document } from "mongoose";

interface Spot {
  size: string;
  vehicle: any | null;
}

export interface ParkingSpotRecordDocument extends Document {
  parkingSpots: Spot[];
}

const ParkingSpotSchema = new Schema<ParkingSpotRecordDocument>({
  parkingSpots: [
    {
      size: { type: String, enum: ["L", "C", "M"], required: true },
      vehicle: { type: Schema.Types.Mixed, default: null },
    },
  ],
});

const ParkingSpotRecord =
  mongoose.models.ParkingSpotRecord ||
  mongoose.model<ParkingSpotRecordDocument>(
    "ParkingSpotRecord",
    ParkingSpotSchema
  );

export default ParkingSpotRecord;

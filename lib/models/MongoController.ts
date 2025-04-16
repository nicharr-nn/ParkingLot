import { NextResponse } from "next/server";
import ParkingSpotRecord from "@/lib/models/ParkingSpot";
import MongoConnectSingleton from "@/lib/mongodb";

export default class MongoController {
  constructor() {}

  static async getParkingSpots(): Promise<NextResponse> {
    try {
      const mongoConnect = MongoConnectSingleton.getInstance();
      await mongoConnect.connectToDB();

      const records = await ParkingSpotRecord.findOne();

      if (!records) {
        throw new Error("No records found");
      }

      return NextResponse.json({
        message: "Fetched parking spots successfully",
        data: records,
      });
    } catch (error) {
      console.error("Error saving parking spots:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  }

  static async saveParkingSpots(req: Request): Promise<NextResponse> {
    try {
      const mongoConnect = MongoConnectSingleton.getInstance();
      await mongoConnect.connectToDB();

      const body = await req.json();
      const { parkingSpots } = body;

      const existing = await ParkingSpotRecord.findOne();

      if (existing) {
        existing.parkingSpots = parkingSpots;
        await existing.save();

        return NextResponse.json({
          message: "Updated existing record",
          id: existing._id,
        });
      } else {
        const record = await ParkingSpotRecord.create({
          parkingSpots,
        });

        return NextResponse.json({
          message: "Saved new record",
          id: record._id,
        });
      }
    } catch (error) {
      console.error("Error saving parking spots:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  }
}
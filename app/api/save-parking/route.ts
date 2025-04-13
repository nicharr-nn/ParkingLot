import { NextResponse } from "next/server";
import MongoConnectSingleton from "@/lib/mongodb";
import ParkingSpotRecord from "@/lib/models/ParkingSpot";

export async function POST(req: Request) {
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
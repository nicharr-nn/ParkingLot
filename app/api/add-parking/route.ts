import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ParkingSpotRecord from "@/lib/models/ParkingSpot";

export async function POST(req: Request) {
  try {
    console.log("Connecting to DB...");
    await connectToDB();
    console.log("DB Connected.");

    const body = await req.json();
    console.log("Received body:", body);

    const { parkingSpots } = body;

    const record = await ParkingSpotRecord.create({
      parkingSpots,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Saved successfully", id: record._id });
  } catch (error) {
    console.error("Error saving parking spots:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

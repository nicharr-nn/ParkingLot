import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ParkingSpotRecord from "@/lib/models/ParkingSpot";

export async function GET() {
  try {
    await connectToDB();

    const records = await ParkingSpotRecord.find();

    return NextResponse.json({
      message: "Fetched parking spots successfully",
      data: records,
    });
  } catch (error) {
    console.error("Error fetching parking spots:", error);
    return NextResponse.json(
      { error: "Failed to fetch parking spots" },
      { status: 500 }
    );
  }
}
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import ParkingSpotRecord from "@/lib/models/ParkingSpot";

export default class MongoConnectSingleton {
  private static instance: MongoConnectSingleton;
  private isConnected: boolean = false;
  private dbUrl: string = process.env.MONGODB_URL || "";

  private constructor() {}

  public static getInstance(): MongoConnectSingleton {
    if (!MongoConnectSingleton.instance) {
      MongoConnectSingleton.instance = new MongoConnectSingleton();
    }
    return MongoConnectSingleton.instance;
  }

  public async connectToDB() {
    if (this.isConnected) {
      console.log("MongoDB is already connected");
      return;
    }

    try {
      if (!this.dbUrl) {
        throw new Error("Database URL is not set");
      }
      await mongoose.connect(this.dbUrl, {
        dbName: "project_0",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as any);
      this.isConnected = true;
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("MongoDB connection error");
    }
  }
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

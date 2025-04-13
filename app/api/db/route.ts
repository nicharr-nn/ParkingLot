import { NextResponse } from "next/server";
import MongoConnectSingleton from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    const mongoConnect = MongoConnectSingleton.getInstance();
    await mongoConnect.connectToDB();
    
    return NextResponse.json({ dbName: mongoose.connection.name });
  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}

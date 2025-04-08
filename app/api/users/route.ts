import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  console.log("🛠 API POST route hit!");
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectToDB();

    const { name, email } = await req.json();
    console.log("📩 Received Data:", { name, email });

    const newUser = new User({ name, email });
    console.log("📝 User Before Saving:", newUser);

    await newUser.save();

    return NextResponse.json(
      { message: "User created", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving user:", error);
    return NextResponse.json({ error: "Error saving user" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

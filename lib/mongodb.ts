import mongoose from "mongoose";

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
}
 
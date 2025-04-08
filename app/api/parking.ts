import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import ParkingLot from "@/app/ParkingLot";
import { createVehicle } from "@/app/api/vehicle";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  switch (req.method) {
    case "GET":
      const parkingLots = await ParkingLot.find().populate("spots.occupiedBy");
      return res.status(200).json(parkingLots);

    case "POST":
      const { vehicleType } = req.body;
      const vehicle = createVehicle(vehicleType);
      if (!vehicle) return res.status(400).json({ error: "Invalid vehicle type" });

      const updatedParking = await vehicle.park();
      return res.status(200).json(updatedParking);

    case "DELETE":
      const { spotId } = req.body;
      await ParkingLot.updateOne({ "spots._id": spotId }, { $set: { "spots.$.occupiedBy": null } });
      return res.status(200).json({ message: "Spot released" });

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

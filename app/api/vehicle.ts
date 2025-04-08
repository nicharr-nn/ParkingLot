import ParkingLot from "@/app/ParkingLot";
import { Motorcycle } from "@/app/api/vehicle/motorcycle";
import { Car } from "@/app/api/vehicle/car";
import { Bus } from "@/app/api/vehicle/bus";

export abstract class Vehicle {
  abstract type: string;
  abstract spotsNeeded: number;

  async park() {
    const parkingLot = await ParkingLot.findOne();
    for (const level of parkingLot.spots) {
      let consecutiveSpots = 0;
      for (const spot of level.spots) {
        if (!spot.occupiedBy) {
          consecutiveSpots++;
          if (consecutiveSpots === this.spotsNeeded) {
            for (let i = 0; i < this.spotsNeeded; i++) {
              level.spots[i].occupiedBy = this.type;
            }
            await parkingLot.save();
            return parkingLot;
          }
        } else {
          consecutiveSpots = 0;
        }
      }
    }
    return null;
  }
}

export function createVehicle(type: string) {
  switch (type) {
    case "motorcycle":
      return new Motorcycle();
    case "car":
      return new Car();
    case "bus":
      return new Bus();
    default:
      return null;
  }
}

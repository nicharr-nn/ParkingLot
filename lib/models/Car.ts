import { AbstractVehicle } from "./Vehicle";
import { ParkingSpot, SpotSize, VehicleSize } from "@/lib/types";


export default class Car extends AbstractVehicle {
  public type = "Car";

  constructor() {
    super({
      spotsNeeded: 1,
      vehicleSize: VehicleSize.Car,
    });
  }

  public getVehicleType(): string {
    return this.type;
  }

  public canPark(spots: ParkingSpot[]) {
    return spots.every(spot => spot.size === SpotSize.Large || spot.size === SpotSize.Compact);
  }
}


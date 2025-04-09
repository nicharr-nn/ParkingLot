import { AbstractVehicle } from "./Vehicle";
import { VehicleSize, SpotSize, ParkingSpot } from "@/lib/types";


export default class Bus extends AbstractVehicle {
  public type = "Bus";

  constructor() {
    super({
      spotsNeeded: 5,
      vehicleSize: VehicleSize.Bus,
    });
  }

  public getVehicleType(): string {
    return this.type;
  }

  public canPark(spots: ParkingSpot[]): boolean {
    return spots.every((spot) => spot.size === SpotSize.Large);
  }
}

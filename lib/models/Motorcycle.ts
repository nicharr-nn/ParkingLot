import { AbstractVehicle } from "./Vehicle";
import { VehicleSize } from "@/lib/types";
import { ParkingSpot, SpotSize } from "@/lib/types";


export default class Motorcycle extends AbstractVehicle {
  public type = "Motorcycle";

  constructor() {
    super({
      spotsNeeded: 1,
      vehicleSize: VehicleSize.Motorcycle,
    });
  }

  public getVehicleType(): string {
    return this.type;
  }

  public canPark(spots: ParkingSpot[]): boolean {
    return spots.every((spot) => spot.size === SpotSize.Motorcycle || spot.size === SpotSize.Compact || spot.size === SpotSize.Large);
  }
}

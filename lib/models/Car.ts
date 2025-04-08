import { AbstractVehicle, VehicleSize } from "./Vehicle";

class Car extends AbstractVehicle {

  public canPark(): boolean {
      throw new Error("Method not implemented.");
  }

  public getVehicleType(): string {
    return "Car";
  }

  constructor() {
    super({
      spotsNeeded: 1,
      vehicleSize: VehicleSize.Compact,
    });
  }
}
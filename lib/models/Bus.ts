import { AbstractVehicle, VehicleSize } from "./Vehicle";

class Bus extends AbstractVehicle {

  public canPark(): boolean {
      throw new Error("Method not implemented.");
  }

  public getVehicleType(): string {
    return "Bus";
  }

  constructor() {
    super({
      spotsNeeded: 5,
      vehicleSize: VehicleSize.Large,
    });
  }
}
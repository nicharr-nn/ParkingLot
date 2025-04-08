import { AbstractVehicle, VehicleSize } from "./Vehicle";


class Motorcycle extends AbstractVehicle {
    public getVehicleType(): string {
      return "Motorcycle";
    }
  
    public canPark(): boolean {
      throw new Error("Method not implemented.");
    }
  
    constructor() {
      super({
        spotsNeeded: 1,
        vehicleSize: VehicleSize.Motorcycle,
      });
    }
  }
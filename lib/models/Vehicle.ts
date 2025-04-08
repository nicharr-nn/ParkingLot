export enum VehicleSize {
    Motorcycle = 'M',   // Motorcycle
    Compact = 'C',      // Compact car
    Large = 'L'         // Large car
}

export interface VehicleProps {
  spotsNeeded: number;
  vehicleSize: VehicleSize;
}

export abstract class AbstractVehicle {
  protected spotsNeeded: number;
  protected vehicleSize: VehicleSize;

  constructor(props: VehicleProps) {
    this.spotsNeeded = props.spotsNeeded;
    this.vehicleSize = props.vehicleSize;
  }

  public abstract getVehicleType(): string;
  public abstract canPark(): boolean;
}

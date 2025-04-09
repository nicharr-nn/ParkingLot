import { ParkingSpot, VehicleProps, VehicleSize } from '@/lib/types';


export abstract class AbstractVehicle {
  public spotsNeeded: number;
  public vehicleSize: VehicleSize;
  public abstract type: string;

  constructor(props: VehicleProps) {
    this.spotsNeeded = props.spotsNeeded;
    this.vehicleSize = props.vehicleSize;
  }

  public abstract getVehicleType(): string;
  public abstract canPark(spots: ParkingSpot[]): boolean;
}

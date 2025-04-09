import { AbstractVehicle } from "../models/Vehicle";

export enum VehicleSize {
    Motorcycle = "Motorcycle",
    Car = "Car",
    Bus = "Bus",
}

export enum SpotSize {
    Motorcycle = "M",
    Compact = "C",
    Large = "L",
}

export interface ParkingSpot {
    size: SpotSize;
    vehicle: Vehicle | null;
}

export interface VehicleProps {
    spotsNeeded: number;
    vehicleSize: VehicleSize;
}

export interface Vehicle extends AbstractVehicle {
    getVehicleType(): string;
    canPark(spots: ParkingSpot[]): boolean;
    type: string;
    spotsNeeded: number;
    vehicleSize: VehicleSize;
}

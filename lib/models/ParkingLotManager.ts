import { VehicleSize, Vehicle, ParkingSpot, SpotSize } from "@/lib/types";
import Car from "@/lib/models/Car";
import Bus from "@/lib/models/Bus";
import Motorcycle from "@/lib/models/Motorcycle";

const vehicleConfigs: Record<VehicleSize, Vehicle> = {
  [VehicleSize.Motorcycle]: new Motorcycle(),
  [VehicleSize.Car]: new Car(),
  [VehicleSize.Bus]: new Bus(),
};

const spotSizes: SpotSize[] = [
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Motorcycle,
  SpotSize.Motorcycle,
  SpotSize.Motorcycle,
];

export default class ParkingLotManager {
  parkingSpots: ParkingSpot[];

  constructor(initialSpots?: ParkingSpot[]) {
    this.parkingSpots =
      initialSpots ?? spotSizes.map((size) => ({ size, vehicle: null }));
  }

  getSpots() {
    return this.parkingSpots;
  }

  setSpots(spots: ParkingSpot[]) {
    this.parkingSpots = spots;
  }

  async loadFromServer() {
    const res = await fetch("/api/get-parking-spots/");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load spots");
    if (data.data?.length) {
      this.parkingSpots = data.data[0].parkingSpots;
    }
  }

  async saveToServer() {
    const res = await fetch("/api/save-parking/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parkingSpots: this.parkingSpots }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save parking data");
  }

  async parkVehicle(vehicleType: VehicleSize): Promise<boolean> {
    const vehicle = vehicleConfigs[vehicleType];

    for (let i = 0; i <= this.parkingSpots.length - vehicle.spotsNeeded; i++) {
      const slice = this.parkingSpots.slice(i, i + vehicle.spotsNeeded);
      const canFit = slice.every((s) => !s.vehicle) && vehicle.canPark(slice);

      if (canFit) {
        for (let j = i; j < i + vehicle.spotsNeeded; j++) {
          this.parkingSpots[j] = { ...this.parkingSpots[j], vehicle };
        }
        await this.saveToServer();
        return true;
      }
    }
    return false;
  }

  async removeVehicle(index: number): Promise<boolean> {
    const startIndex = this.findVehicleStartIndex(index);
    if (startIndex === -1) return false;

    const vehicle = this.parkingSpots[startIndex].vehicle;
    if (!vehicle) return false;

    for (let i = startIndex; i < startIndex + vehicle.spotsNeeded; i++) {
      this.parkingSpots[i] = { ...this.parkingSpots[i], vehicle: null };
    }

    await this.saveToServer();
    return true;
  }

  private findVehicleStartIndex(index: number): number {
    for (let i = index; i >= 0; i--) {
      const v = this.parkingSpots[i].vehicle;
      if (!v) break;

      const slice = this.parkingSpots.slice(i, i + v.spotsNeeded);
      const isSameVehicle = slice.every((s) => s.vehicle?.type === v.type);
      if (isSameVehicle) return i;
    }
    return -1;
  }
}
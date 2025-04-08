"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

enum VehicleType {
  Motorcycle = "Motorcycle",
  Car = "Car",
  Bus = "Bus",
}

enum SpotSize {
  Motorcycle = "M",
  Compact = "C",
  Large = "L",
}

interface Vehicle {
  type: VehicleType;
  size: SpotSize;
  spotsNeeded: number;
}

interface ParkingSpot {
  size: SpotSize;
  vehicle: Vehicle | null;
}

const vehicleConfigs: Record<VehicleType, Vehicle> = {
  [VehicleType.Motorcycle]: { type: VehicleType.Motorcycle, size: SpotSize.Motorcycle, spotsNeeded: 1 },
  [VehicleType.Car]: { type: VehicleType.Car, size: SpotSize.Compact, spotsNeeded: 1 },
  [VehicleType.Bus]: { type: VehicleType.Bus, size: SpotSize.Large, spotsNeeded: 5 },
};

const TOTAL_SPOTS = 20;
const spotSizes: SpotSize[] = [
  SpotSize.Motorcycle,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Motorcycle,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Large,
  SpotSize.Compact,
  SpotSize.Compact,
  SpotSize.Motorcycle,
  SpotSize.Compact,
];

function canFit(spotSize: SpotSize, vehicleSize: SpotSize): boolean {
  if (vehicleSize === SpotSize.Motorcycle) return true;
  if (vehicleSize === SpotSize.Compact) return spotSize === SpotSize.Compact || spotSize === SpotSize.Large;
  if (vehicleSize === SpotSize.Large) return spotSize === SpotSize.Large;
  return false;
}

export default function ParkingLotUI() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(
    spotSizes.map((size) => ({ size, vehicle: null }))
  );
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);

  const handlePark = () => {
    if (!selectedVehicle) return;
    const vehicle = vehicleConfigs[selectedVehicle];

    for (let i = 0; i <= TOTAL_SPOTS - vehicle.spotsNeeded; i++) {
      const spotsToCheck = parkingSpots.slice(i, i + vehicle.spotsNeeded);
      const canAllFit = spotsToCheck.every(
        (spot) => spot.vehicle === null && canFit(spot.size, vehicle.size)
      );
      if (canAllFit) {
        const updated = [...parkingSpots];
        for (let j = i; j < i + vehicle.spotsNeeded; j++) {
          updated[j] = { ...updated[j], vehicle };
        }
        setParkingSpots(updated);
        return;
      }
    }
    alert("No available spots for this vehicle.");
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">🚗 Parking Lot Simulation</h1>

      <div className="flex items-center gap-4 mb-6">
        <Select onValueChange={(v) => setSelectedVehicle(v as VehicleType)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={VehicleType.Motorcycle}>🏍️ Motorcycle</SelectItem>
            <SelectItem value={VehicleType.Car}>🚗 Car</SelectItem>
            <SelectItem value={VehicleType.Bus}>🚌 Bus</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handlePark} disabled={!selectedVehicle}>Park Vehicle</Button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {parkingSpots.map((spot, idx) => (
          <Card key={idx} className={`h-16 flex items-center justify-center ${
            spot.vehicle ? "bg-green-200" : "bg-muted"
          }`}>
            <CardContent className="p-2 text-center">
              <div className="text-xs text-gray-600">Spot {idx + 1} ({spot.size})</div>
              {spot.vehicle ? `${spot.vehicle.type}` : <span className="text-gray-400">Empty</span>}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

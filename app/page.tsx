"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleSize, SpotSize, Vehicle, ParkingSpot } from "@/lib/types";
import Car from "@/lib/models/Car";
import Bus from "@/lib/models/Bus";
import Motorcycle from "@/lib/models/Motorcycle";

const vehicleConfigs: Record<VehicleSize, Vehicle> = {
  [VehicleSize.Motorcycle]: new Motorcycle(),
  [VehicleSize.Car]: new Car(),
  [VehicleSize.Bus]: new Bus(),
};


const TOTAL_SPOTS = 20;
const spotSizes: SpotSize[] = [
  SpotSize.Large, SpotSize.Large, SpotSize.Large, SpotSize.Large, SpotSize.Large,
  SpotSize.Large, SpotSize.Large, SpotSize.Large, SpotSize.Large, SpotSize.Large,
  SpotSize.Compact, SpotSize.Compact, SpotSize.Compact, SpotSize.Compact, SpotSize.Compact,
  SpotSize.Compact, SpotSize.Compact, SpotSize.Motorcycle, SpotSize.Motorcycle, SpotSize.Motorcycle,
];

export default function ParkingLotUI() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(
    spotSizes.map((size) => ({ size, vehicle: null }))
  );
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSize | null>(null);

  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const res = await fetch("/api/get-parking-spots/");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        if (data.data && data.data.length > 0) {
          const latest = data.data[0];
          setParkingSpots(latest.parkingSpots);
        }
      } catch (err) {
        console.error("Error fetching parking spots:", err);
      }
    };

    fetchParkingSpots();
  }, []);

  const handlePark = async () => {
    if (!selectedVehicle) return;

    const vehicleInstance = vehicleConfigs[selectedVehicle];

    for (let i = 0; i <= TOTAL_SPOTS - vehicleInstance.spotsNeeded; i++) {
      const spotsToCheck = parkingSpots.slice(i, i + vehicleInstance.spotsNeeded);

      const canAllFit = spotsToCheck.every((spot) => spot.vehicle === null) &&
        vehicleInstance.canPark(spotsToCheck);

      if (canAllFit) {
        const updated = [...parkingSpots];

        for (let j = i; j < i + vehicleInstance.spotsNeeded; j++) {
          updated[j] = {
            ...updated[j],
            vehicle: vehicleInstance
          };
        }

        setParkingSpots(updated);

        try {
          const res = await fetch("/api/save-parking/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ parkingSpots: updated }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Save to DB failed");
        } catch (err) {
          alert("Failed to save parking data.");
        }

        return;
      }
    }

    alert("No available spots for this vehicle.");
  };

  const findVehicleStartIndex = (clickedIndex: number, spots: ParkingSpot[]) => {
    for (let i = clickedIndex; i >= 0; i--) {
      const spot = spots[i];
      if (!spot.vehicle) break;

      const vehicle = spot.vehicle;
      const slice = spots.slice(i, i + vehicle.spotsNeeded);
      const isSameVehicle = slice.every(
        (s) => s.vehicle && s.vehicle.type === vehicle.type
      );

      if (isSameVehicle) return i;
    }

    return -1;
  };


  const handleRemoveVehicle = async (clickedIndex: number) => {
    const clickedSpot = parkingSpots[clickedIndex];

    if (!clickedSpot.vehicle) return;

    const spotsNeeded = clickedSpot.vehicle.spotsNeeded;

    const vehicleStartIndex = findVehicleStartIndex(clickedIndex, parkingSpots);

    if (vehicleStartIndex === -1) return;

    const updated = [...parkingSpots];
    for (let i = vehicleStartIndex; i < vehicleStartIndex + spotsNeeded; i++) {
      updated[i] = { ...updated[i], vehicle: null };
    }

    setParkingSpots(updated);

    try {
      const res = await fetch("/api/save-parking/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parkingSpots: updated }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      alert("Vehicle removed and parking data saved.");
    } catch (err) {
      alert("Failed to save after removing vehicle.");
    }
  };


  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">🚗 Parking Lot Simulation</h1>

      <div className="flex items-center gap-4 mb-6">
        <Select onValueChange={(v) => setSelectedVehicle(v as VehicleSize)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={VehicleSize.Motorcycle}>🏍️ Motorcycle</SelectItem>
            <SelectItem value={VehicleSize.Car}>🚗 Car</SelectItem>
            <SelectItem value={VehicleSize.Bus}>🚌 Bus</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handlePark} disabled={!selectedVehicle}>Park Vehicle</Button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {parkingSpots.map((spot, idx) => (
          <Card
            key={idx}
            onClick={() => handleRemoveVehicle(idx)}
            className={`cursor-pointer h-16 flex items-center justify-center ${spot.vehicle ? "bg-green-200 hover:bg-red-200" : "bg-muted"
              }`}
          >
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

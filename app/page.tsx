"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleSize, ParkingSpot } from "@/lib/types";
import ParkingLotManager from "../lib/models/ParkingLotManager";

export default function ParkingLotUI() {
  const [manager] = useState(() => new ParkingLotManager());
  const [spots, setSpots] = useState<ParkingSpot[]>(manager.getSpots());
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSize | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await manager.loadFromServer();
        setSpots([...manager.getSpots()]);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [manager]);

  const handlePark = async () => {
    if (!selectedVehicle) return;

    const success = await manager.parkVehicle(selectedVehicle);
    if (!success) return alert("No available spots for this vehicle.");

    setSpots([...manager.getSpots()]);
  };

  const handleRemove = async (idx: number) => {
    const success = await manager.removeVehicle(idx);
    if (success) {
      setSpots([...manager.getSpots()]);
      alert("Vehicle removed and saved.");
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
        {spots.map((spot, idx) => (
          <Card
            key={idx}
            onClick={() => handleRemove(idx)}
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
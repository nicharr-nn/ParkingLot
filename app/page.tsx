"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleSize, SpotSize, Vehicle, ParkingSpot } from "@/lib/types";
import Car from "@/lib/models/Car";
import Bus from "@/lib/models/Bus";
import Motorcycle from "@/lib/models/Motorcycle";
import { AbstractVehicle } from "@/lib/models/Vehicle";

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

  const canFit = (spotSize: SpotSize, vehicleSize: VehicleSize): boolean => {
    if (spotSize === SpotSize.Motorcycle && vehicleSize === VehicleSize.Motorcycle) {
      return true;
    } else if (spotSize === SpotSize.Compact && (vehicleSize === VehicleSize.Car || vehicleSize === VehicleSize.Motorcycle)) {
      return true;
    } else if (spotSize === SpotSize.Large && (vehicleSize === VehicleSize.Car || vehicleSize === VehicleSize.Bus)) {
      return true;
    }
    return false;
  };


  const handlePark = async () => {
    if (!selectedVehicle) return;
    
    // เลือกรถจาก vehicleConfigs โดยใช้ selectedVehicle
    const vehicle = vehicleConfigs[selectedVehicle];
    const vehicleInstance = vehicle;  // vehicleInstance คือ class หรือ object ที่สร้างจาก Vehicle
    
    // ลูปหาตำแหน่งที่สามารถจอดรถได้
    for (let i = 0; i <= TOTAL_SPOTS - vehicleInstance.spotsNeeded; i++) {
      const spotsToCheck = parkingSpots.slice(i, i + vehicleInstance.spotsNeeded);
  
      // เช็คว่า spots ที่เลือกว่างหรือไม่และมีขนาดที่ตรงกัน
      const canAllFit = spotsToCheck.every(
        (spot) => spot.vehicle === null && canFit(spot.size, vehicleInstance.vehicleSize)
      );
  
      // ถ้าหาพื้นที่ที่เหมาะสมได้
      if (canAllFit) {
        const updated = [...parkingSpots];
        
        // อัปเดตสถานะของที่จอดรถด้วยการใส่ vehicleInstance ลงไป
        for (let j = i; j < i + vehicleInstance.spotsNeeded; j++) {
          updated[j] = { 
            ...updated[j], 
            vehicle: vehicleInstance // เพิ่มรถเข้าไปในที่จอดรถ
          };
        }
        setParkingSpots(updated); // อัปเดตสถานะที่จอดรถ
        return; // ออกจากฟังก์ชันเมื่อสำเร็จ
      }
    }
  
    // แจ้งเตือนกรณีไม่มีที่จอดรถว่าง
    alert("No available spots for this vehicle.");
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

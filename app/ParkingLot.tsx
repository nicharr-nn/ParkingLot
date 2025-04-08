import { useState, useEffect } from "react";

interface ParkingSpot {
  _id: string;
  occupiedBy?: string;
  type: string;
}

interface ParkingLevel {
  level: number;
  spots: ParkingSpot[];
}

export default function ParkingLot() {
  const [parkingData, setParkingData] = useState<ParkingLevel[]>([]);
  
  useEffect(() => {
    fetch("/api/parking")
      .then((res) => res.json())
      .then((data) => setParkingData(data));
  }, []);
  
  const parkVehicle = async (vehicleType: string) => {
    const res = await fetch("/api/parking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleType })
    });
    const updatedData = await res.json();
    setParkingData(updatedData);
  };

  const releaseSpot = async (spotId: string) => {
    await fetch("/api/parking", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spotId })
    });
    fetch("/api/parking")
      .then((res) => res.json())
      .then((data) => setParkingData(data));
  };

    const findSpotById = (id: string) => {
        for (const level of parkingData) {
        const spot = level.spots.find((spot) => spot._id === id);
        if (spot) return spot;
        }
        return null;
    };

  return (
    <div>
      {parkingData.map((level) => (
        <div key={level.level} className="border p-4 rounded-lg shadow mb-4">
          <h2 className="text-xl font-semibold">Level {level.level}</h2>
          <div className="grid grid-cols-10 gap-1 mt-2">
            {level.spots.map((spot) => (
              <button
                key={spot._id}
                className={`p-2 rounded border ${spot.occupiedBy ? "bg-red-500" : "bg-green-500"}`}
                onClick={() => spot.occupiedBy && releaseSpot(spot._id)}
              >
                {spot.occupiedBy ? `${spot.type} - ${spot.occupiedBy}` : "Free"}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-4">
        <button className="bg-blue-500 text-white p-2 rounded mr-2" onClick={() => parkVehicle("motorcycle")}>Park Motorcycle</button>
        <button className="bg-blue-500 text-white p-2 rounded mr-2" onClick={() => parkVehicle("car")}>Park Car</button>
        <button className="bg-blue-500 text-white p-2 rounded" onClick={() => parkVehicle("bus")}>Park Bus</button>
      </div>
    </div>
  );
}

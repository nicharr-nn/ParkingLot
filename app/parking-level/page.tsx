'use client';

import React from "react";
import { Button } from "@/components/ui/button";

const ParkingLevelAddView = () => {
    const parkingSpots = [
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "L", vehicle: null },
        { size: "C", vehicle: null },
        { size: "C", vehicle: null },
        { size: "C", vehicle: null },
        { size: "C", vehicle: null },
        { size: "C", vehicle: null },
        { size: "M", vehicle: null },
        { size: "M", vehicle: null },
        { size: "M", vehicle: null },
        { size: "M", vehicle: null },
        { size: "M", vehicle: null },
    ];

    const handleSaveParkingSpots = async () => {
        try {
            const response = await fetch("/api/add-parking/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ parkingSpots }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            alert("✅ Parking spots saved successfully! ID: " + data.id);
        } catch (error) {
            console.error("Save error:", error);
            alert("❌ Failed to save parking spots.");
        }
    };

    return (
        <div className="mt-6 text-center">
            <Button onClick={handleSaveParkingSpots}>Add Parking Spots</Button>
        </div>
    );
};

export default ParkingLevelAddView;

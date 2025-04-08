import { Vehicle } from "@/app/api/vehicle";

export class Bus extends Vehicle {
  type = "Bus";
  spotsNeeded = 5;
  condition = "Good";
}

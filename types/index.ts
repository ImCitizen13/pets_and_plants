export type Entry = {
    id: string;
    name: string;
    type: "pet" | "plant";
    frequency: number; // in hours
    timeToNextAction: Date; // in hours
    lastDone: number; // timestamp
    notificationsEnabled?: boolean;
  };
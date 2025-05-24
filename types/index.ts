export type Entry = {
    id: string;
    name: string;
    type: "pet" | "plant";
    animalType?: AnimalType;
    frequency: number; // in hours
    timeToNextAction: number; // timestamp of next action
    lastDone: number; // timestamp
    notificationsEnabled?: boolean;
  };
  export enum AnimalType {
    DOG = "dog",
    CAT = "cat",
  }

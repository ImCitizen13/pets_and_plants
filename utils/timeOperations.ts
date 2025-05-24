import { Entry } from "@/types";

export const getTimeRemaining = (entry: Entry) => {
  const hoursSinceLastDone = (Date.now() - entry.lastDone) / (1000 * 60 * 60);
  const hoursRemaining = Math.max(0, entry.frequency - hoursSinceLastDone);

  if (hoursRemaining === 0) {
    return "Now";
  } else if (hoursRemaining < 1) {
    return `In ${Math.round(hoursRemaining * 60)}m`;
  } else if (entry.frequency < 24) {
    return `In ${Math.round(entry.frequency)}h`;
  } else {
    return `In ${Math.round(entry.frequency / 24)}d`;
  }
};


export const getTimeInMiliseconds = (frequency: number) => {
  return Date.now() + frequency * 60 * 60 * 1000;
};

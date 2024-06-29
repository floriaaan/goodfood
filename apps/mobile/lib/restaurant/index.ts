import { Restaurant } from "@/types/restaurant";

export const isOpenNow = (openingHours: Restaurant["openinghoursList"]) => {
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert current time to HHMM format

  return openingHours.some((period) => {
    let [start, end] = period.split("-").map((time) => {
      if (time === "00h") return 2400; // Special handling for "00h" to represent midnight as 2400 for comparison
      const [hours, minutes] = time.split("h").map(Number);
      return hours * 100 + minutes; // Convert times to HHMM format
    });

    if (end === 2400) end = 0; // Convert 2400 back to 0 for correct comparison logic

    // Adjust for ranges that end after midnight
    if (start > end) {
      // If current time is after start time or before midnight
      if (currentTime >= start || currentTime < end) return true;
    } else {
      // Normal range comparison
      if (currentTime >= start && currentTime < end) return true;
    }

    return false;
  });
};

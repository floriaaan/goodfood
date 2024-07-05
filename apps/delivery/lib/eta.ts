const DEFAULT_INTERVAL = 10;

export const formatEta = (duration_in_seconds: number) => {
  const now = new Date();
  const eta = new Date(now.getTime() + duration_in_seconds * 1000);

  // Round minutes to nearest 5 and handle hour changes
  let startMinutes = Math.round(eta.getMinutes() / 5) * 5 - DEFAULT_INTERVAL;
  let endMinutes = Math.round(eta.getMinutes() / 5) * 5 + DEFAULT_INTERVAL;
  let startHour = eta.getHours();
  let endHour = eta.getHours();

  if (startMinutes < 0) {
    startMinutes += 60;
    startHour -= 1;
  }

  if (endMinutes >= 60) {
    endMinutes -= 60;
    endHour += 1;
  }

  // Ensure hours are within 0-23 range
  if (startHour < 0) startHour += 24;
  if (endHour > 23) endHour -= 24;

  // If start time is less than current time, set start time to current time
  if (startHour < now.getHours() || (startHour === now.getHours() && startMinutes < now.getMinutes())) {
    startHour = now.getHours();
    startMinutes = now.getMinutes();
  }

  // Pad minutes and hours with leading zeros if they are less than 10
  const paddedStartMinutes = String(startMinutes).padStart(2, "0");
  const paddedEndMinutes = String(endMinutes).padStart(2, "0");
  const paddedStartHour = String(startHour).padStart(2, "0");
  const paddedEndHour = String(endHour).padStart(2, "0");

  return `${paddedStartHour}:${paddedStartMinutes} - ${paddedEndHour}:${paddedEndMinutes}`;
};

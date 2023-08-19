import { Interval } from "@stock/types";

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export const fromInterval = (
  interval: Interval,
  date?: string
): {
  start: Date;
  end: Date;
} => {
  const end = date
    ? new Date(date + " 23:59:59")
    : new Date(new Date().setHours(23, 59, 59, 999));

  const start = // end - interval
    interval === "1w"
      ? new Date(end.getTime() - 7 * DAY_IN_MS)
      : interval === "1m"
      ? new Date(end.getTime() - 30 * DAY_IN_MS)
      : interval === "1y"
      ? new Date(end.getTime() - 365 * DAY_IN_MS)
      : // default to 1w
        new Date(end.getTime() - 7 * DAY_IN_MS);

  return { start, end };
};

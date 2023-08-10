import { fromInterval } from "@stock/lib/date";
import { Interval } from "@stock/types";
import { assert, describe, it, vitest } from "vitest";

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

// fake current date

describe("tests@goodfood/stock.date.fromInterval", function () {
  it('should return start and end dates for interval "1w"', (t) => {
    const interval = "1w";
    const date = "2023-07-01";
    const expected = {
      start: new Date("2023-06-24 23:59:59"),
      end: new Date("2023-07-01 23:59:59"),
    };
    const result = fromInterval(interval, date);
    assert.deepEqual(result, expected);
  });

  it('should return start and end dates for interval "1m"', (t) => {
    const interval = "1m";
    const date = "2023-07-01";
    const expected = {
      start: new Date("2023-06-01 23:59:59"),
      end: new Date("2023-07-01 23:59:59"),
    };
    const result = fromInterval(interval, date);
    assert.deepEqual(result, expected);
  });

  it('should return start and end dates for interval "1y"', (t) => {
    const interval = "1y";
    const date = "2023-07-01";
    const expected = {
      start: new Date("2022-07-01 23:59:59"),
      end: new Date("2023-07-01 23:59:59"),
    };
    const result = fromInterval(interval, date);
    assert.deepEqual(result, expected);
  });

  it('should return start and end dates with default interval "1w"', (t) => {
    const interval = "invalid-interval";
    const date = "2023-07-01";
    const expected = {
      start: new Date("2023-06-24 23:59:59"),
      end: new Date("2023-07-01 23:59:59"),
    };
    const result = fromInterval(interval as Interval, date);
    assert.deepEqual(result, expected);
  });

  it("should return current date as end date when no date parameter is provided", (t) => {
    const interval = "1w";
    const expectedEnd = new Date();
    expectedEnd.setHours(23, 59, 59, 999);

    const result = fromInterval(interval, undefined);
    assert.deepEqual(result.end, expectedEnd);
  });

  it("should return start date based on the current date when no date parameter is provided", (t) => {
    const interval = "1w";
    const date = new Date("2023-07-01 13:37");
    vitest.setSystemTime(date);

    const currentDate = new Date();
    const expectedStart = new Date(
      new Date(currentDate.getTime() - 7 * DAY_IN_MS).setHours(23, 59, 59, 999)
    );

    const result = fromInterval(interval, undefined);
    assert.deepEqual(result.start, expectedStart);
  });
});

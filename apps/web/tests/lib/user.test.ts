import { describe, expect, test } from "vitest";
import { user } from "@/constants/data";
import { toName } from "@/lib/user";

describe("test toName function", () => {
  test("should return concat first name and name", () => {
    const result = toName(user);
    expect(result).toBe("John Doe");
  });

  test("should return unknown user", () => {
    const result = toName(null);
    expect(result).toBe("Utilisateur inconnu");
  });
});

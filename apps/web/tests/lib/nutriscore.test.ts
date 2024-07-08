import { describe, expect, test } from "vitest";
import { getNutriscoreImageUrl } from "@/lib/product/nutriscore";
import { Product } from "@/types/product";
import { productList } from "@/constants/data";

describe("test getNutriscoreImageUrl function", () => {
  test("should return -a", () => {
    const result = getNutriscoreImageUrl({ ...productList[0], nutriscore: "A" } as Product);
    const regex = /-([a-z])/gim;
    const match = result.match(regex);
    if (!match) throw new Error("No match found");
    expect(match[0]).toBe("-a");
  });

  test("should return -b", () => {
    const result = getNutriscoreImageUrl({ ...productList[0], nutriscore: "B" } as Product);
    const regex = /-([a-z])/gim;
    const match = result.match(regex);
    if (!match) throw new Error("No match found");
    expect(match[0]).toBe("-b");
  });

  test("should return -c", () => {
    const result = getNutriscoreImageUrl(productList[0] as Product);
    const regex = /-([a-z])/gim;
    const match = result.match(regex);
    if (!match) throw new Error("No match found");
    expect(match[0]).toBe("-c");
  });

  test("should return -d", () => {
    const result = getNutriscoreImageUrl({ ...productList[0], nutriscore: "D" } as Product);
    const regex = /-([a-z])/gim;
    const match = result.match(regex);
    if (!match) throw new Error("No match found");
    expect(match[0]).toBe("-d");
  });

  test("should return -e", () => {
    const result = getNutriscoreImageUrl({ ...productList[0], nutriscore: "E" } as Product);
    const regex = /-([a-z])/gim;
    const match = result.match(regex);
    if (!match) throw new Error("No match found");
    expect(match[0]).toBe("-e");
  });
});

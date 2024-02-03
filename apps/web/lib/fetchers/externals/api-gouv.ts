import { Result } from "@/types/externals/api-gouv";

export const searchAddress = async (q: string) => {
  if (!q) throw new Error("Missing query");
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${q}&limit=5`);

  const res = await response.json();
  return res as Result;
};

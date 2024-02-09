import { Result } from "@/types/externals/api-gouv";

export const searchAddress = async (q: string) => {
  if (!q) throw new Error("Missing query");
  q = q.replaceAll(" ", "+");
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${q}&limit=5`);

  const res = await response.json();
  return res as Result;
};

export const getAddress = async (lat: number, lon: number) => {
  if (!lat || !lon) throw new Error("Missing lat or lon");
  const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`);

  const res = await response.json();
  return res as Result;
};

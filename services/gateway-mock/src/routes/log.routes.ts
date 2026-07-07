import { Request, Response, Router } from "express";
import { withCheck } from "@mock/lib/auth";
import { faker } from "@faker-js/faker";

export const logRoutes = Router();

const logs = Array.from({ length: 20 }, (_, i) => ({
  id: `log-${i + 1}`,
  level: faker.helpers.arrayElement(["info", "warn", "error"]),
  message: faker.lorem.sentence(),
  createdAt: faker.date.recent().toISOString(),
}));

logRoutes.get("/api/log", withCheck({ role: "ADMIN" }), (_req: Request, res: Response) => {
  return res.status(200).json({ logsList: logs });
});

logRoutes.get("/api/log/:id", withCheck({ role: "ADMIN" }), (req: Request, res: Response) => {
  const log = logs.find((l) => l.id === req.params.id);
  if (!log) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(log);
});

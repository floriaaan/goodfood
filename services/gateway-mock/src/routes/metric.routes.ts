import { Request, Response, Router } from "express";
import { withCheck } from "@mock/lib/auth";

export const metricRoutes = Router();

// Metrics aren't consumed by the frontend today; kept minimal so calling code doesn't 404.
type MetricEntry = Record<string, unknown> & { id: string; restaurantId?: string; restaurantGroupId?: string };
const metrics: MetricEntry[] = [];

const requireManagerOrAdmin = withCheck({ role: ["MANAGER", "ADMIN"] });

metricRoutes.post("/api/metric/by-restaurant-and-date", requireManagerOrAdmin, (_req: Request, res: Response) =>
  res.status(200).json({ metricsList: metrics }),
);

metricRoutes.get("/api/metric/by-restaurant/:restaurantId", requireManagerOrAdmin, (req: Request, res: Response) =>
  res.status(200).json({ metricsList: metrics.filter((m) => m.restaurantId === req.params.restaurantId) }),
);

metricRoutes.get("/api/metric/by-restaurant-group/:restaurantGroupId", requireManagerOrAdmin, (req: Request, res: Response) =>
  res.status(200).json({ metricsList: metrics.filter((m) => m.restaurantGroupId === req.params.restaurantGroupId) }),
);

metricRoutes.get("/api/metric/restaurant/:restaurantId", requireManagerOrAdmin, (req: Request, res: Response) => {
  const metric = metrics.find((m) => m.restaurantId === req.params.restaurantId);
  return metric ? res.status(200).json(metric) : res.status(404).json({ message: "Not found" });
});

metricRoutes.get("/api/metric/restaurant-group/:restaurantGroupId", requireManagerOrAdmin, (req: Request, res: Response) => {
  const metric = metrics.find((m) => m.restaurantGroupId === req.params.restaurantGroupId);
  return metric ? res.status(200).json(metric) : res.status(404).json({ message: "Not found" });
});

metricRoutes.post("/api/metric/restaurant", requireManagerOrAdmin, (req: Request, res: Response) => {
  const metric: MetricEntry = { id: `metric-${metrics.length + 1}`, ...req.body };
  metrics.push(metric);
  return res.status(201).json(metric);
});

metricRoutes.post("/api/metric/restaurant-group", requireManagerOrAdmin, (req: Request, res: Response) => {
  const metric: MetricEntry = { id: `metric-${metrics.length + 1}`, ...req.body };
  metrics.push(metric);
  return res.status(201).json(metric);
});

metricRoutes.put("/api/metric/restaurant/:restaurantId", requireManagerOrAdmin, (req: Request, res: Response) => {
  const metric = metrics.find((m) => m.restaurantId === req.params.restaurantId);
  if (!metric) return res.status(404).json({ message: "Not found" });
  Object.assign(metric, req.body);
  return res.status(200).json(metric);
});

metricRoutes.put("/api/metric/restaurant-group/:restaurantGroupId", requireManagerOrAdmin, (req: Request, res: Response) => {
  const metric = metrics.find((m) => m.restaurantGroupId === req.params.restaurantGroupId);
  if (!metric) return res.status(404).json({ message: "Not found" });
  Object.assign(metric, req.body);
  return res.status(200).json(metric);
});

metricRoutes.delete("/api/metric/restaurant/:restaurantId", requireManagerOrAdmin, (req: Request, res: Response) => {
  const index = metrics.findIndex((m) => m.restaurantId === req.params.restaurantId);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = metrics.splice(index, 1);
  return res.status(200).json(removed);
});

metricRoutes.delete("/api/metric/restaurant-group/:restaurantGroupId", (req: Request, res: Response) => {
  const index = metrics.findIndex((m) => m.restaurantGroupId === req.params.restaurantGroupId);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = metrics.splice(index, 1);
  return res.status(200).json(removed);
});

metricRoutes.post("/api/metric", requireManagerOrAdmin, (req: Request, res: Response) => {
  const metric: MetricEntry = { id: `metric-${metrics.length + 1}`, ...req.body };
  metrics.push(metric);
  return res.status(201).json(metric);
});

metricRoutes.get("/api/metric/:key", requireManagerOrAdmin, (req: Request, res: Response) => {
  const metric = metrics.find((m) => m.id === req.params.key);
  return metric ? res.status(200).json(metric) : res.status(404).json({ message: "Not found" });
});

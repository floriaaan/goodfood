import { Request, Response, Router } from "express";
import { db } from "@mock/lib/db";
import { decodeToken, getTokenFromHeader, ROLES, signToken, withCheck } from "@mock/lib/auth";
import { User } from "@mock/types";

export const userRoutes = Router();

userRoutes.post("/api/user/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  return res.status(200).json({ user, token: signToken(user), error: null });
});

userRoutes.post("/api/user/validate", (req: Request, res: Response) => {
  const decoded = decodeToken(getTokenFromHeader(req) ?? "");
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });
  return res.status(200).json({ valid: true, ...decoded });
});

userRoutes.post("/api/user/register", (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone, country, zipCode, street, lat, lng, roleCode } = req.body;
  const id = `user-${db.users.length + 1}`;
  const user: User = {
    id,
    firstName,
    lastName,
    email,
    password,
    phone,
    mainaddressid: `addr-${id}`,
    mainaddress: { id: `addr-${id}`, street, zipcode: zipCode, country, city: "", lat, lng },
    roleid: 3,
    role: { id: 3, code: roleCode ?? ROLES.USER, label: roleCode ?? ROLES.USER },
  };
  db.users.push(user);
  return res.status(201).json(user);
});

userRoutes.get("/api/user", withCheck({ role: "ADMIN" }), (_req: Request, res: Response) => {
  return res.status(200).json({ usersList: db.users });
});

userRoutes.get("/api/user/:id", (req: Request, res: Response) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  const userNotifications = db.notifications.filter((n) => n.userId === user.id);
  return res.status(200).json({ ...user, notifications: userNotifications });
});

userRoutes.put("/api/user", (req: Request, res: Response) => {
  const decoded = decodeToken(getTokenFromHeader(req) ?? "");
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  const user = db.users.find((u) => u.id === decoded.id);
  if (!user) return res.status(404).json({ message: "Not found" });

  const { firstName, lastName, email, phone, country, zipCode, street, lat, lng } = req.body;
  Object.assign(user, { firstName, lastName, email, phone });
  Object.assign(user.mainaddress, { country, zipcode: zipCode, street, lat, lng });
  return res.status(200).json(user);
});

userRoutes.put("/api/user/password", (req: Request, res: Response) => {
  const decoded = decodeToken(getTokenFromHeader(req) ?? "");
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  const user = db.users.find((u) => u.id === decoded.id);
  if (!user) return res.status(404).json({ message: "Not found" });

  const { oldpassword, password } = req.body;
  if (user.password !== oldpassword) return res.status(403).json({ message: "Wrong password" });
  user.password = password;
  return res.status(200).json(user);
});

userRoutes.put("/api/user/:id/role", withCheck({ role: ["ADMIN"] }), (req: Request, res: Response) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });

  const code = req.body.role;
  user.role = { id: user.roleid, code, label: code };
  return res.status(200).json(user);
});

userRoutes.delete("/api/user/:id", (req: Request, res: Response) => {
  const index = db.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const [removed] = db.users.splice(index, 1);
  return res.status(200).json(removed);
});

export const mainAddressRoutes = Router();

mainAddressRoutes.get("/api/user/main-address/:id", (req: Request, res: Response) => {
  const user = db.users.find((u) => u.mainaddress.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(user.mainaddress);
});

mainAddressRoutes.put("/api/user/main-address/:id", (req: Request, res: Response) => {
  const user = db.users.find((u) => u.mainaddress.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  Object.assign(user.mainaddress, req.body);
  return res.status(200).json(user.mainaddress);
});

import { User } from "@gateway/proto/user_pb";
import { user_service_promises } from "@gateway/services/user.service";

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  ACCOUNTANT: "ACCOUNTANT",
  DELIVERER: "DELIVERER",
};

const checkRole = async (token: string, expectedRole: keyof typeof ROLES) => {
  const userId = await user_service_promises.getUserIdFromToken(token);
  if (userId === undefined) return false;
  const user = await user_service_promises.getUser(userId);
  if (user === undefined) return false;
  return user.getRole()?.getCode() === expectedRole;
};

const checkRight = async (token: string, expectedId: number) => {
  const userId = await user_service_promises.getUserIdFromToken(token);
  if (userId === undefined) return false;
  return userId === expectedId;
};

export const check = async (
  token: string,
  expect: {
    role?: keyof typeof ROLES;
    id?: number;
  }
) => {
  const { role, id } = expect;
  if (role !== undefined && id !== undefined)
    return (await checkRole(token, role)) && (await checkRight(token, id));
  else if (role !== undefined) return await checkRole(token, role);
  else if (id !== undefined) return await checkRight(token, id);
  else return false;
};

import { Request, Response, NextFunction } from "express";

export const withCheck =
  (expect: { role?: keyof typeof ROLES; id?: number }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { role, id } = expect;
    const token = req.headers.authorization?.split("Bearer ")[0];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const authorized = await check(token, { role, id });
      if (authorized) return next();
      else return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

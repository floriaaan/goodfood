import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role, User } from "@mock/types";

const JWT_SECRET = process.env.JWT_SECRET || "mock-secret";

export const ROLES: Record<Role["code"], Role["code"]> = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
  DELIVERY_PERSON: "DELIVERY_PERSON",
};

export type TokenPayload = { id: string; role: Role["code"] };

export const signToken = (user: User): string =>
  jwt.sign({ id: user.id, role: user.role.code } as TokenPayload, JWT_SECRET, { expiresIn: "30d" });

export const decodeToken = (token: string): TokenPayload | undefined => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return undefined;
  }
};

export const getTokenFromHeader = (req: Request): string | undefined => req.headers.authorization?.split("Bearer ")[1];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

type CheckExpectation = { role?: Role["code"] | Role["code"][]; id?: string | ((req: Request) => string) };

// Any bearer token minted by this mock's /api/user/login is accepted; there is no real
// microservice to round-trip through, so role/identity checks read straight off the JWT claims.
export const withCheck =
  ({ role, id }: CheckExpectation = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = decodeToken(token);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    const roleOk = !role || (Array.isArray(role) ? role.includes(decoded.role) : decoded.role === role);
    const expectedId = typeof id === "function" ? id(req) : id;
    const idOk = !expectedId || decoded.id === expectedId;
    if (!roleOk || !idOk) return res.status(403).json({ message: "Forbidden" });

    req.auth = decoded;
    return next();
  };

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  const decoded = decodeToken(token);
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });
  req.auth = decoded;
  return next();
};

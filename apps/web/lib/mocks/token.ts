import { User } from "@/types/user";

export type TokenPayload = { id: string; role: string };

// Not a real JWT: there is no service boundary to protect here, only enough structure
// for the mock router to read back the id/role it put in at login time.
export const signToken = (user: User): string => {
  const payload: TokenPayload = { id: user.id, role: user.role.code };
  return typeof window !== "undefined" ? window.btoa(JSON.stringify(payload)) : Buffer.from(JSON.stringify(payload)).toString("base64");
};

export const decodeToken = (token?: string | null): TokenPayload | undefined => {
  if (!token) return undefined;
  try {
    const json = typeof window !== "undefined" ? window.atob(token) : Buffer.from(token, "base64").toString("utf-8");
    const payload = JSON.parse(json);
    if (typeof payload?.id !== "string" || typeof payload?.role !== "string") return undefined;
    return payload;
  } catch {
    return undefined;
  }
};

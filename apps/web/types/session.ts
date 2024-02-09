import { User } from "@/types/user";

export type Session = {
  user: User;
  token: string;
};

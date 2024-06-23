import { DeliveryPerson } from "@/types/delivery";
import { User } from "@/types/user";

export const toName = (user: User | DeliveryPerson | null | undefined) => {
  if (!user) return "Utilisateur inconnu";
  return `${user.firstName} ${user.lastName}`;
};

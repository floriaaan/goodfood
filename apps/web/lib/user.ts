import {User} from "@/types/user";

export const toName = (user: User | null | undefined) => {
    if(!user) return 'Utilisateur inconnu';
    return `${user.firstName} ${user.lastName}`;
}
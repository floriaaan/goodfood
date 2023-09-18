import { BasketProvider } from "@/hooks/useBasket";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <BasketProvider>{children}</BasketProvider>;
}

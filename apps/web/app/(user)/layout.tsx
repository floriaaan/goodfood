import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";
import { BasketProvider } from "@/hooks/useBasket";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <BasketProvider>
      <Navbar />
      {children}
      <Footer />
    </BasketProvider>
  );
}

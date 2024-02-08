import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";
import { LocationProvider } from "@/hooks";
import { BasketProvider } from "@/hooks/useBasket";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <BasketProvider>
        <Navbar />
        {children}
        <Footer />
      </BasketProvider>
    </LocationProvider>
  );
}

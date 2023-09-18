import { Catalog } from "@/components/catalog";
import { RatingSection } from "@/app/(user)/(home)/rating";
import { BasketWrapper } from "@/components/basket";
import { Navbar } from "@/components/ui/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <RatingSection />
      <div className="relative p-2">
        <main className="sticky mx-auto grid max-w-7xl gap-2 border border-gray-100 p-2 lg:grid-cols-3">
          <Catalog />
          <BasketWrapper />
        </main>
      </div>
    </>
  );
}

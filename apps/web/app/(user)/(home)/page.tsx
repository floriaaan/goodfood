import { Catalog } from "@/components/catalog";
import { RatingSection } from "@/app/(user)/(home)/rating";
import { BasketWrapper } from "@/components/basket";
import { Navbar } from "@/components/ui/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <RatingSection />
      <div className="relative p-2 has-background-grid">
        <main className="sticky mx-auto grid shadow-xl max-w-7xl gap-2 border bg-white border-gray-100 p-2 lg:grid-cols-3">
          <Catalog />
          <div className="hidden lg:block">
            <BasketWrapper />
          </div>
        </main>
      </div>
    </>
  );
}

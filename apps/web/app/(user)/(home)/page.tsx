import { Catalog } from "@/components/catalog";
import { RatingSection } from "@/app/(user)/(home)/rating";
import { BasketWrapper } from "@/components/basket";

export default function Home() {
  return (
    <>
      <RatingSection />
      <div className="has-background-grid grow h-full relative p-2 py-6">
        <main className="sticky mx-auto grid max-w-7xl gap-2 border border-gray-100 bg-white p-2 shadow-xl lg:grid-cols-3">
          <Catalog />
          <div className="hidden lg:block">
            <BasketWrapper />
          </div>
        </main>
      </div>
    </>
  );
}

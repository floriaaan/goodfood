import { Catalog } from "@/app/(user)/(home)/catalog";
import { CTA } from "@/app/(user)/(home)/cta";
import { BasketWrapper } from "@/components/basket";
import { RatingBanner } from "@/app/(user)/(home)/rating-banner";

export default function Home() {
  return (
    <>
      <RatingBanner />
      <CTA />
      <div className="has-background-grid relative h-full grow p-2 py-6">
        <main className="sticky mx-auto grid max-w-[86rem] gap-2 border border-gray-100 bg-white p-2  lg:grid-cols-3">
          <Catalog />
          <div className="hidden lg:block">
            <BasketWrapper />
          </div>
        </main>
      </div>
    </>
  );
}

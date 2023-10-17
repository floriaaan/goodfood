"use client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks";
import { MdRateReview } from "react-icons/md";
export const RatingBanner = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Alert className="px-9 text-sm bg-muted">
      <AlertTitle className="inline-flex items-center gap-2">
        <MdRateReview className="w-4 h-4 shrink-0" />
        <span>
          <strong>{user?.firstName}</strong>
          {", comment s'est passé votre dernière commande ?"}
        </span>
        <a href="#" className="underline">
          Laisser un avis
        </a>
      </AlertTitle>
    </Alert>
  );
};

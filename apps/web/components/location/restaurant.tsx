import { Logo } from "@/components/ui/icon/logo";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "@/hooks/useLocation";
import { cn } from "@/lib/utils";
import { Restaurant } from "@/types/restaurant";
import { getDistance } from "geolib";
import { MdLocationOff, MdLocationOn } from "react-icons/md";

export const LocationRestaurant = ({
  onClick,
  ...restaurant
}: {
  onClick: () => void;
} & Restaurant) => {
  const { selectedRestaurantId, selectRestaurant } = useBasket();
  const { lat, lng } = useLocation();

  return (
    <button
      onClick={() => {
        selectRestaurant(restaurant.id);
        onClick();
      }}
      key={restaurant.id}
      className={cn(
        "flex flex-col gap-y-2 border-2 p-3",
        selectedRestaurantId === restaurant.id ? "border-gray-500 bg-gray-50" : "border-gray-200",
      )}
    >
      <div className="inline-flex w-full items-start justify-between">
        <div className="inline-flex gap-x-2 md:items-center">
          <Logo className="h-4 w-min sm:h-6" />
          <span className="text-sm font-bold">{restaurant.name}</span>
        </div>
        {!isNaN(lat) && !isNaN(lng) ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold">
            <MdLocationOn className="h-4 w-4" />
            {`${(
              getDistance(
                { latitude: lat, longitude: lng },
                {
                  latitude: restaurant.address.lat,
                  longitude: restaurant.address.lng,
                },
              ) / 1000
            ).toFixed(1)} km`}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold">
            <MdLocationOff className="h-4 w-4" />
            Localisation indisponible
          </span>
        )}
      </div>
      <div className="inline-flex items-center gap-x-1 text-xs font-light">
        {
          // todo: opening hours
          true ? (
            <>
              <span className="h-2 w-2 rounded-full bg-green-600"></span> Ouvert
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-red-600"></span> Fermé
            </>
          )
        }
        {` • `}
        {restaurant.openinghoursList.join(" - ")}
      </div>
    </button>
  );
};

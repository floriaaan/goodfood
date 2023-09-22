import { Location } from "@/components/location";
import { MdOutlineLocationOn } from "react-icons/md";

export const LocationDropdown = () => {
  return (
    <Location
      trigger={
        <div className="gf_shadow flex h-10 w-10 shrink-0 items-center justify-center border border-black lg:hidden">
          <MdOutlineLocationOn className="h-5 w-5" />
        </div>
      }
    />
  );
};

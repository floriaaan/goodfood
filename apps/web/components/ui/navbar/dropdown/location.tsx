import { MdOutlineLocationOn } from "react-icons/md";

export const LocationDropdown = () => {
  return (
    <button className="gf_shadow flex h-10 w-10 shrink-0 lg:hidden items-center justify-center border border-black">
      <MdOutlineLocationOn className="h-5 w-5" />
    </button>
  );
};

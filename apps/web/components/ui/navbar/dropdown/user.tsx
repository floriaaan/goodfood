import { MdOutlineAccountBox } from "react-icons/md";

export const UserDropdown = () => {
  return (
    <button className="gf_shadow relative flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-white">
      <MdOutlineAccountBox className="h-5 w-5" />
    </button>
  );
};

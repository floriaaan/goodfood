import { MdOutlineShoppingBasket } from "react-icons/md";

export const BasketDropdown = () => {
  return (
    <button className="gf_shadow flex h-10 w-10 shrink-0 items-center justify-center border border-black">
      <MdOutlineShoppingBasket className="h-5 w-5" />
    </button>
  );
};

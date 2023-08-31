import classNames from "classnames";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MdArrowForwardIos, MdOutlineLocationOn } from "react-icons/md";

export const Location = ({ className }: { className?: string }) => {
  return (
    <div className={classNames("items-center gap-x-3", className)}>
      <MdOutlineLocationOn className="h-7 w-7 shrink-0" />
      <div className="flex max-w-sm grow flex-col gap-y-0.5">
        <span className="text-xs font-bold">23 rue Amiral Cécille - 76100 Rouen</span>
        <span className="text-xs">{`${format(new Date(), "eeee d MMMM", { locale: fr })} - (12:15 - 12:35)`}</span>
      </div>
      <MdArrowForwardIos className="h-5 w-5 shrink-0 rotate-90" />
    </div>
  );
};

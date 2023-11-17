import { useCatalogFilters } from "@/app/(normal)/(home)/catalog";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";

export const CatalogFilters = () => {
  const { type, setType } = useCatalogFilters();
  return (
    <div className="inline-flex h-fit overflow-x-auto sm:col-span-2 lg:col-span-3">
      <button
        onClick={() => setType(ProductType.ENTREES)}
        className={cn(
          "inline-flex h-12 w-24 shrink-0 items-center justify-center gap-x-2 border-b-2 text-xs font-bold duration-200 sm:w-1/5",
          type === ProductType.ENTREES ? "border-gray-800" : "border-gray-300",
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path
            d="M15.91 9.84a2.05 2.05 0 0 0-1.45-3.48A2.04 2.04 0 0 0 13 9.84H15.92ZM11.36 9.84a2.11 2.11 0 1 0-4.14 0h4.13ZM16.48 17.25H7.4v.38h9.1v-.38ZM21 9.84s-3.1 7.41-9 7.41-9-7.41-9-7.41h18Z"
            stroke="#222"
            strokeWidth="1.5"
            strokeLinejoin="bevel"
          />
        </svg>
        Entrées
      </button>
      <button
        onClick={() => setType(ProductType.PLATS)}
        className={cn(
          "inline-flex h-12 w-24 shrink-0 items-center justify-center gap-x-2 border-b-2 text-xs font-bold duration-200 sm:w-1/5",
          type === ProductType.PLATS ? "border-gray-800" : "border-gray-300",
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path
            d="M0 17.4h24M21 17.1a9 9 0 0 0-18 0M12.7 7.3a.7.7 0 1 0-1.4 0"
            stroke="#222"
            strokeWidth="1.5"
            strokeLinejoin="bevel"
          />
          <path d="M11.9 11c-1.9 0-3.6.9-4.6 2.3" stroke="#222" strokeWidth="1.5" strokeLinejoin="bevel" />
        </svg>
        Plats
      </button>
      <button
        onClick={() => setType(ProductType.DESSERTS)}
        className={cn(
          "inline-flex h-12 w-24 shrink-0 items-center justify-center gap-x-2 border-b-2 text-xs font-bold duration-200 sm:w-1/5",
          type === ProductType.DESSERTS ? "border-gray-800" : "border-gray-300",
        )}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.1859 14.43L16.835 20.345H9.49003L7.28003 14.43"
            stroke="#222222"
            strokeWidth="1.5"
            strokeLinejoin="bevel"
          />
          <path
            d="M11.9275 18.4925L11.2342 16.2825M14.365 18.4925L15.21 16.2825M17.94 8.55834C17.745 8.55834 17.55 8.58 17.3767 8.62334C17.0431 7.7472 16.4506 6.99344 15.6781 6.46235C14.9055 5.93127 13.9896 5.64805 13.0521 5.65041C12.1146 5.65276 11.2001 5.94056 10.4302 6.47552C9.66035 7.01047 9.07166 7.76721 8.7425 8.645C8.20249 8.525 7.64052 8.54771 7.11196 8.71091C6.58339 8.87411 6.10644 9.17217 5.72807 9.57573C5.34971 9.97929 5.08298 10.4744 4.95415 11.0124C4.82532 11.5504 4.83883 12.1127 4.99336 12.6438C5.14788 13.175 5.43808 13.6568 5.83539 14.0417C6.2327 14.4266 6.72342 14.7014 7.25922 14.839C7.79501 14.9766 8.35742 14.9723 8.89105 14.8265C9.42468 14.6807 9.91113 14.3985 10.3025 14.0075C11.0999 14.6056 12.0682 14.9322 13.065 14.9392C14.105 14.9392 15.0042 14.6142 15.7625 14.0617C16.1407 14.4179 16.6003 14.6763 17.1012 14.8141C17.6022 14.952 18.1292 14.9653 18.6365 14.8527C19.1437 14.7401 19.6157 14.5052 20.0113 14.1683C20.4069 13.8315 20.7141 13.403 20.906 12.9202C21.098 12.4374 21.169 11.9149 21.1127 11.3984C21.0564 10.8819 20.8747 10.387 20.5832 9.95687C20.2918 9.52672 19.8996 9.17441 19.4407 8.93064C18.9819 8.68687 18.4704 8.55906 17.9508 8.55834H17.94V8.55834Z"
            stroke="#222222"
            strokeWidth="1.5"
            strokeLinejoin="bevel"
          />
        </svg>
        Desserts
      </button>
      <button
        onClick={() => setType(ProductType.BOISSONS)}
        className={cn(
          "inline-flex h-12 w-24 shrink-0 items-center justify-center gap-x-2 border-b-2 text-xs font-bold duration-200 sm:w-1/5",
          type === ProductType.BOISSONS ? "border-gray-800" : "border-gray-300",
        )}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.93751 10.5625H17.0625M8.93751 15.4375H17.0625M10.5625 4.225H15.4375M14.6683 1.625H11.3317V4.44167L9.85834 5.87167L8.38501 9.75V24.375H17.615V9.75L16.1308 5.8825L14.6683 4.44167V1.625V1.625Z"
            stroke="#222222"
            strokeWidth="1.5"
            strokeLinejoin="bevel"
          />
        </svg>
        Boissons
      </button>
      <button
        onClick={() => setType(ProductType.SNACKS)}
        className={cn(
          "inline-flex h-12 w-24 shrink-0 items-center justify-center gap-x-2 border-b-2 text-xs font-bold duration-200 sm:w-1/5",
          type === ProductType.SNACKS ? "border-gray-800" : "border-gray-300",
        )}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.4375 20.3125L16.185 15.4375M10.5625 20.3125L9.7825 15.4375M4.0625 10.5625L10.5625 4.0625M21.9375 10.5625L13.8125 5.6875M24.375 10.5625H1.625V13.8125H24.375V10.5625ZM19.7492 21.9375H6.25083L3.25 13.8125H22.75L19.7492 21.9375Z"
            stroke="#222222"
            strokeWidth="1.5"
          />
        </svg>
        Snacks
      </button>
    </div>
  );
};

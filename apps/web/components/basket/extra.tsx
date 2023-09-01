import { MdAdd } from "react-icons/md";

export const BasketExtra = () => {
  return (
    <section className="flex flex-col gap-y-1">
      <div className="inline-flex w-full items-center justify-between bg-gray-100 py-1.5 pl-3 pr-1.5">
        <span className="text-sm font-bold">Pain</span>
        <div className="inline-flex items-center gap-x-2">
          <span className="text-xs font-light">
            dès <strong className="font-bold">0€15</strong>
          </span>
          <button className="flex h-8 w-8 items-center justify-center border bg-gray-200">
            <MdAdd className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-0.5 bg-gray-100 py-1.5 pl-3 pr-1.5">
        <div className="inline-flex w-full items-center justify-between ">
          <span className="text-sm font-bold">Couverts</span>
          <div className="inline-flex items-center gap-x-2">
            <span className="text-xs font-light">
              dès <strong className="font-bold">0€15</strong>
            </span>
            <button className="flex h-8 w-8 items-center justify-center border bg-gray-200">
              <MdAdd className="h-4 w-4" />
            </button>
          </div>
        </div>
        <span className="text-[10px] text-gray-500">Bio-dégradables 🌱</span>
        <span className="text-[10px] text-gray-500">Fourchette, couteau, cuillère et serviette</span>
      </div>
    </section>
  );
};

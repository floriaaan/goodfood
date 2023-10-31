import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/form-select";
import { useState } from "react";
import { MdAdd } from "react-icons/md";

type SelectQuantityValue = number | string;

type SelectQuantityOption = {
  value: number | string;
  label: string;
};

type SelectQuantity = {
  value: SelectQuantityValue;
  quantity: number;
};

type State = SelectQuantity[];
type SetState = React.Dispatch<React.SetStateAction<State>>;

type SelectQuantityProps = {
  options: SelectQuantityOption[];
  placeholder: string;

  state: State;
  setState: SetState;
};

export const SelectQuantity = ({ options, state, setState, placeholder }: SelectQuantityProps) => {
  const [select, setSelect] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  return (
    <div className="inline-flex items-center gap-x-4">
      <Select value={select} onValueChange={(e) => setSelect(e)}>
        <SelectTrigger className="h-12 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={`select_quantity-${placeholder.toLowerCase()}-${o.value}`} value={o.value.toString()}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormInput
        placeholder="Quantité"
        value={quantity}
        onChange={(e) => setQuantity(e.target.valueAsNumber)}
        type="number"
        className="h-12 w-24"
      />
      <Button
        type="button"
        className="h-12 w-12"
        onClick={() => {
          if (select === "") return;
          if (quantity === 0) return;

          if (!(state.findIndex((o) => o.value === select) !== -1))
            setState((old) => [...old, { value: select, quantity: quantity }]);
          else setState((old) => old.map((o) => (o.value === select ? { ...o, quantity } : o)));

          setSelect("");
          setQuantity(0);
        }}
      >
        <MdAdd className="h-4 w-4" />
      </Button>
    </div>
  );
};

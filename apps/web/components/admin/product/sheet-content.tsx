import { ProductCreateEditForm, ProductCreateEditFormValues } from "@/components/admin/product/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";

export const ProductFormSheetContent = ({ initialValues }: { initialValues?: ProductCreateEditFormValues }) => {
  const onSubmit = (values: ProductCreateEditFormValues) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  const onImageChange = (file: File) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("https://picsum.photos/200/300");
      }, 1000);
    });
  };

  return (
    <SheetContent side="right" className="w-full border-l-0 sm:max-w-xl">
      <div className="flex h-full w-full">
        <ProductCreateEditForm {...{ onSubmit, onImageChange, initialValues }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};
